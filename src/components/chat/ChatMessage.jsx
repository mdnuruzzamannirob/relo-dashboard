import { Check } from "lucide-react";

const ChatMessage = ({ message, isOwn, showAvatar }) => {
  const senderName = message.sender?.name || "";
  const senderAvatar = message.sender?.profileImage;

  const formattedTime = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const hasImages = message.images && message.images.length > 0;
  const hasText = message.message && message.message.trim().length > 0;

  return (
    <div className={`flex gap-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && showAvatar && (
        <div className="mt-auto shrink-0">
          {senderAvatar ? (
            <img
              src={senderAvatar}
              alt={senderName}
              className="h-7 w-7 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-100 text-xs font-medium text-brand-600">
              {senderName?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>
      )}

      {!isOwn && !showAvatar && <div className="w-7 shrink-0" />}

      <div
        className={`flex max-w-[80%] flex-col sm:max-w-xs ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        {hasImages && (
          <div
            className={`mb-1 flex flex-wrap gap-1 ${
              isOwn ? "justify-end" : "justify-start"
            }`}
          >
            {message.images.map((img, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-lg border border-slate-200"
              >
                <img
                  src={img}
                  alt={`image-${idx}`}
                  className="max-h-48 w-auto object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {hasText && (
          <div
            className={`inline-block rounded-2xl px-3.5 py-2 text-sm ${
              isOwn
                ? "rounded-br-none bg-brand-500 text-white"
                : "rounded-bl-none border border-slate-200 bg-white text-slate-800"
            }`}
          >
            <p className="whitespace-pre-wrap wrap-break-word">
              {message.message}
            </p>
          </div>
        )}

        <div
          className={`mt-0.5 flex items-center gap-1 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span className="text-[10px] text-slate-400">{formattedTime}</span>
          {isOwn && <Check className="h-3 w-3 text-slate-400" />}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
