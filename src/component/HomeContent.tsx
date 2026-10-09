"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import ClientWrapper from "./ClientWrapper";
import Loading from "./Loading";
import Mainpage from "./Mainpage";

export default function HomeContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      {/* 本文は最初から描画し、静的HTMLにも含めます。読み込み演出だけを上に重ねます。 */}
      {/* 告知の演出は読み込み画面が消え始めてから。本文の静的出力は維持します。 */}
      <ClientWrapper><Mainpage announcementReady={!isLoading} /></ClientWrapper>
      {/* JavaScriptを使わない閲覧環境では、演出が消えず本文を覆わないようにします。 */}
      <noscript><style>{"#homepage-loading { display: none; }"}</style></noscript>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            id="homepage-loading"
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[998] flex items-center justify-center bg-background"
            aria-hidden="true"
          >
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
