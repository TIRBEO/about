import { useLayoutEffect, useRef, useCallback, type ReactNode } from "react";
import "./ScrollStack.css";

export const ScrollStackItem = ({ children, itemClassName = "" }: { children: ReactNode; itemClassName?: string }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

interface ScrollStackProps {
  children: ReactNode;
  className?: string;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

export default function ScrollStack({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Element[]>([]);
  const lastTransformsRef = useRef(new Map<number, { translateY: number; scale: number; rotation: number; blur: number }>());
  const rafRef = useRef(0);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return typeof value === "string" ? parseFloat(value) : value;
  }, []);

  const originalsRef = useRef<number[]>([]);
  const endTopRef = useRef(0);

  const tick = useCallback(() => {
    const cards = cardsRef.current;
    const originals = originalsRef.current;
    if (!cards.length || !originals.length) return;

    const scrollTop = useWindowScroll ? window.scrollY : scrollerRef.current!.scrollTop;
    const containerHeight = useWindowScroll ? window.innerHeight : scrollerRef.current!.clientHeight;

    const sp = parsePercentage(stackPosition, containerHeight);
    const ep = parsePercentage(scaleEndPosition, containerHeight);
    const endTop = endTopRef.current;

    cards.forEach((card, i) => {
      const ct = originals[i];
      const ts = ct - sp - itemStackDistance * i;
      const te = ct - ep;
      const ps = ct - sp - itemStackDistance * i;
      const pe = endTop - containerHeight / 2;

      const p = scrollTop < ts ? 0 : scrollTop > te ? 1 : (scrollTop - ts) / (te - ts);
      const targetScale = baseScale + i * itemScale;
      const s = 1 - p * (1 - targetScale);
      const r = rotationAmount ? i * rotationAmount * p : 0;
      const ty = scrollTop < ps ? 0 : scrollTop > pe ? pe - ct + sp + itemStackDistance * i : scrollTop - ct + sp + itemStackDistance * i;

      const el = card as HTMLElement;
      el.style.transform = `translate3d(0,${Math.round(ty)}px,0) scale(${Math.round(s * 1000) / 1000}) rotate(${Math.round(r * 100) / 100}deg)`;
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, rotationAmount, useWindowScroll, parsePercentage]);

  useLayoutEffect(() => {
    const scroller = useWindowScroll ? document.documentElement : scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll(".scroll-stack-card")
        : scroller.querySelectorAll(".scroll-stack-card")
    );
    cardsRef.current = cards;

    originalsRef.current = cards.map((c) => {
      if (useWindowScroll) {
        const r = c.getBoundingClientRect();
        return r.top + window.scrollY;
      }
      return (c as HTMLElement).offsetTop;
    });

    const endEl = scroller.querySelector(".scroll-stack-end");
    if (endEl) {
      if (useWindowScroll) {
        const r = endEl.getBoundingClientRect();
        endTopRef.current = r.top + window.scrollY;
      } else {
        endTopRef.current = (endEl as HTMLElement).offsetTop;
      }
    }

    cards.forEach((c, i) => {
      const el = c as HTMLElement;
      if (i < cards.length - 1) {
        el.style.marginBottom = `${itemDistance}px`;
      }
      el.style.willChange = "transform, filter";
      el.style.transformOrigin = "top center";
      el.style.backfaceVisibility = "hidden";
    });

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      cardsRef.current = [];
      originalsRef.current = [];
      lastTransformsRef.current.clear();
    };
  }, [itemDistance, itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, rotationAmount, blurAmount, useWindowScroll, onStackComplete, tick]);

  return (
    <div className={`scroll-stack-scroller ${className}`} ref={scrollerRef}>
      <div className="scroll-stack-inner">{children}</div>
      <div className="scroll-stack-end" />
    </div>
  );
}
