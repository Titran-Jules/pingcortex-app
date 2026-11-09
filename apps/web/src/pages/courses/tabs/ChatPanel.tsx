import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, NeumorphicCard, PromptInput, toast } from '@pingcortex/ui';
import { MessageSquare, Plus, RotateCcw, TriangleAlert } from 'lucide-react';
import type { ChatMessageResponse, ChatSessionResponse } from '@pingcortex/shared-types';
import { api } from '../../../api/api';
import { getErrorMessage } from '../../../errors/getErrorMessage';
import { queryKeys } from '../../../lib/queryKeys';
import { formatDateTime } from '../../../lib/format';

const BubbleContent: Record<ChatMessageResponse['role'], string> = {
    USER: 'bg-secondary/15 px-4 py-3 text-sm whitespace-pre-line text-main-text',
    ASSISTANT:
        'bg-container-bg px-4 py-3 text-sm whitespace-pre-line text-main-text shadow-neu-flat-sm',
};

const MessageBubble: React.FC<{ message: ChatMessageResponse }> = ({ message }) => {
    const isUser = message.role === 'USER';
    return (
        <div
            className={`flex max-w-[95%] flex-col gap-1 ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
        >
            <div className={BubbleContent[message.role]}>{message.content}</div>
            <span className="px-1 text-[10px] font-medium text-sub-text">{formatDateTime(message.createdAt)}</span>
        </div>
    );
};

const RetryNotice: React.FC<{ error: unknown; onRetry: () => void }> = ({ error, onRetry }) => (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-core-bg px-4 py-3 shadow-neu-pressed-sm">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-sub-text">
            <TriangleAlert size={14} className="text-amber-500" />
            {getErrorMessage(error)}
        </span>
        <Button variant="ghost" size="sm" leftIcon={<RotateCcw size={13} />} onClick={onRetry}>
            Réessayer
        </Button>
    </div>
);

const SessionPill: React.FC<{
    session: ChatSessionResponse;
    isActive: boolean;
    onSelect: (sessionId: string) => void;
}> = ({ session, isActive, onSelect }) => (
    <button
        type="button"
        aria-pressed={isActive}
        onClick={() => onSelect(session.id)}
        className={
            'rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-[0.98] motion-reduce:transition-none ' +
            (isActive
                ? 'bg-secondary text-on-secondary shadow-glow-secondary'
                : 'bg-core-bg text-sub-text shadow-neu-flat-sm hover:text-main-text')
        }
    >
        Session du {formatDateTime(session.createdAt)}
    </button>
);

export const ChatPanel: React.FC<{ courseId: string }> = ({ courseId }) => {
    const queryClient = useQueryClient();
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);

    const {
        data: sessions,
        isPending: sessionsPending,
        isError: sessionsError,
        error: sessionsApiError,
        refetch: refetchSessions,
    } = useQuery({
        queryKey: queryKeys.courses.chatSessions(courseId),
        queryFn: () => api.chat.getChatSessions(courseId),
    });

    const orderedSessions = useMemo(
        () => (sessions ? sessions.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : []),
        [sessions]
    );

    const effectiveSessionId = sessionId ?? orderedSessions[0]?.id ?? null;

    const addSession = useMutation({
        mutationFn: () => api.chat.addNewChatSession(courseId),
        onSuccess: (session) => {
            queryClient.setQueryData<ChatSessionResponse[]>(
                queryKeys.courses.chatSessions(courseId),
                (prev) => [...(prev ?? []), session]
            );
            setSessionId(session.id);
        },
        onError: (mutationError) =>
            toast.error('Session impossible', { description: getErrorMessage(mutationError) }),
    });

    const {
        data: messages,
        isPending: messagesPending,
        isError: messagesError,
        error: messagesApiError,
        refetch: refetchMessages,
    } = useQuery({
        queryKey: queryKeys.courses.chatMessages(effectiveSessionId ?? ''),
        queryFn: () => api.chat.getMessagesBySessionId(effectiveSessionId ?? ''),
        enabled: effectiveSessionId !== null,
    });

    const sendMessage = useMutation({
        mutationFn: (content: string) => {
            if (!effectiveSessionId) {
                return Promise.reject(new Error('Aucune session active.'));
            }
            return api.chat.sendNewMessage(effectiveSessionId, { content });
        },
        onSuccess: (exchange) => {
            if (!effectiveSessionId) return;
            queryClient.setQueryData<ChatMessageResponse[]>(
                queryKeys.courses.chatMessages(effectiveSessionId),
                (prev) => [...(prev ?? []), exchange.userMessage, exchange.assistantMessage]
            );
        },
        onError: (mutationError) =>
            toast.error('Envoi impossible', { description: getErrorMessage(mutationError) }),
    });

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages, sendMessage.isPending]);

    const hasSessions = orderedSessions.length > 0;
    const hasMessages = messages !== undefined && messages.length > 0;

    return (
        <NeumorphicCard variant="flat" className="flex flex-col gap-4 rounded-3xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-main-text/10 pb-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-main-text">
                    <MessageSquare size={16} className="text-primary" />
                    Chat du cours
                    {hasSessions && (
                        <span className="text-xs font-medium text-sub-text">
                            · {orderedSessions.length} {orderedSessions.length > 1 ? 'sessions' : 'session'}
                        </span>
                    )}
                </h3>
                <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Plus size={14} />}
                    loading={addSession.isPending}
                    onClick={() => addSession.mutate()}
                >
                    Nouvelle session
                </Button>
            </div>

            {sessionsError && <RetryNotice error={sessionsApiError} onRetry={() => refetchSessions()} />}

            {sessionsPending && <div className="h-64 animate-pulse rounded-2xl bg-container-bg" />}

            {!sessionsPending && !hasSessions && (
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-core-bg py-10 shadow-neu-pressed-sm text-center">
                    <MessageSquare size={28} className="text-sub-text" />
                    <p className="text-sm font-bold text-main-text">Aucune session de discussion</p>
                    <p className="max-w-sm text-xs text-sub-text">
                        Ouvrez une session pour questionner PingCortex sur ce cours : explications, quiz guidés,
                        tutorat personnalisé…
                    </p>
                    <Button
                        variant="generate"
                        isGlowing
                        size="sm"
                        loading={addSession.isPending}
                        onClick={() => addSession.mutate()}
                    >
                        Démarrer une session
                    </Button>
                </div>
            )}

            {!sessionsPending && hasSessions && (
                <div role="group" aria-label="Sessions de discussion" className="flex flex-wrap gap-2">
                    {orderedSessions.map((session) => (
                        <SessionPill
                            key={session.id}
                            session={session}
                            isActive={session.id === effectiveSessionId}
                            onSelect={setSessionId}
                        />
                    ))}
                </div>
            )}

            {!sessionsPending && hasSessions && (
                <div className="flex max-h-96 min-h-64 flex-col gap-4 overflow-y-auto pr-1" aria-live="polite">
                    {messagesError && <RetryNotice error={messagesApiError} onRetry={() => refetchMessages()} />}

                    {messagesPending && !messagesError && (
                        <div className="flex flex-col gap-3">
                            <div className="h-10 w-3/5 animate-pulse rounded-2xl bg-container-bg" />
                            <div className="h-10 w-1/2 animate-pulse rounded-2xl bg-container-bg" />
                            <div className="h-10 w-2/5 animate-pulse rounded-2xl bg-container-bg" />
                        </div>
                    )}

                    {hasMessages &&
                        messages?.map((message) => <MessageBubble key={message.id} message={message} />)}

                    {sendMessage.isPending && (
                        <div className="flex max-w-[95%] flex-col items-start gap-1 self-start">
                            <div className="h-10 w-40 animate-pulse rounded-2xl bg-container-bg shadow-neu-flat-sm" />
                            <span className="px-1 text-[10px] font-medium text-sub-text">PingCortex écrit…</span>
                        </div>
                    )}

                    {!messagesPending &&
                        !messagesError &&
                        messages?.length === 0 &&
                        !sendMessage.isPending && (
                            <p className="py-8 text-center text-xs text-sub-text">
                                Aucun échange pour le moment : lancez la conversation ci-dessous.
                            </p>
                        )}

                    <div ref={bottomRef} />
                </div>
            )}

            <div className="border-t border-main-text/10 pt-4">
                <PromptInput
                    onSubmit={(value) => sendMessage.mutate(value)}
                    loading={sendMessage.isPending}
                    placeholder={hasSessions ? 'Posez une question sur ce cours…' : 'Créez une session pour discuter…'}
                    suggestions={[
                        'Explique-moi le premier concept de ce cours',
                        'Fais-moi un quiz sur ce cours',
                        'Propose-moi un exercice Feynman',
                    ]}
                />
            </div>
        </NeumorphicCard>
    );
};
