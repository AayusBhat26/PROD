import { useEffect, useState } from "react";

type ChatScrollProps = {
      chatRef: React.RefObject<HTMLDivElement>;
      bottomRef: React.RefObject<HTMLDivElement>;
      shouldLoadMore: boolean;
      loadMore: () => void;
      count: number;
}
export const useScroll = ({
      chatRef, bottomRef, shouldLoadMore, count, loadMore
}: ChatScrollProps) => {
      const [isInitialized, setIsInitialized] = useState(false);
      useEffect(() => {
            const mostSignificantDiv = chatRef?.current;
            const handleScroll = () => {
                  const top = mostSignificantDiv?.scrollTop;
                  if (top === 0 && shouldLoadMore) {
                        loadMore();
                  }
            }
            mostSignificantDiv?.addEventListener("scroll", handleScroll);
            return () => {
                  mostSignificantDiv?.removeEventListener("scroll", handleScroll);
            }
      }, [shouldLoadMore, loadMore, chatRef])
      useEffect(() => {
            const leastSignificantDiv = bottomRef?.current;
            const mostSignificantDiv = chatRef?.current;
            const autoScroll = () => {
                  if (!isInitialized && leastSignificantDiv) {
                        setIsInitialized(true);
                        return true;
                  }
                  if (!mostSignificantDiv) {
                        return false;
                  }
                  const diff = mostSignificantDiv.scrollHeight - mostSignificantDiv.scrollTop - mostSignificantDiv.clientHeight;
                  return diff <= 100;
            }
            if (autoScroll()) {
                  setTimeout(() => {
                        bottomRef.current?.scrollIntoView({
                              behavior: "smooth"
                        })
                  }, 100)
            }
      }, [bottomRef, chatRef, count, isInitialized])
}