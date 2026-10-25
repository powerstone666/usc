// Short, self-contained answer placed near the top of a page. Answer engines and voice
// assistants quote text like this, so it names the business, the place and the key facts.
// `data-answer-block` is also the CSS selector referenced by the page's speakable markup.
export function AnswerBlock({ children, label = "Quick answer" }: { children: string; label?: string }) {
  return (
    <div className="mt-5 max-w-2xl rounded-2xl border border-white/25 bg-white/10 p-4">
      <p className="text-sm font-bold uppercase tracking-wide text-on-primary/85">{label}</p>
      <p data-answer-block className="mt-1 text-base text-on-primary">
        {children}
      </p>
    </div>
  );
}
