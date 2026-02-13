import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({ role, content }) => {
    return (
        <div className={`message-bubble ${role}`}>
            <div className="message-content">
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        // Optional: custom renderers for code blocks, etc.
                        code({node, inline, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                                <pre className="code-block">
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            ) : (
                                <code className="inline-code" {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
            <div className="message-timestamp">
                {new Date().toLocaleTimeString()}
            </div>
        </div>
    );
};

export default MessageBubble;