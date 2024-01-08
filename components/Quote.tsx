"use client";
import React, { useMemo } from "react";

import { quotes } from "@/constants/quotes";

// It shows a random quote and its author
const QuoteAndAuthor = () => {
  const quotesCnt = quotes.length;
  const randomQuoteNumber = useMemo(() => {
    return Math.floor(Math.random() * quotesCnt);
  }, [quotesCnt]);

  return (
    <div className="absolute bottom-6 flex flex-col justify-center items-center">
      <p className="text-base md:text-lg lg:text-xl text-white text-center px-3">
        {`"${quotes[randomQuoteNumber].quote}"`}
      </p>
      <p className="text-base md:text-lg lg:text-xl text-white text-center px-3">
        {`${quotes[randomQuoteNumber].author}`}
      </p>
    </div>
  );
};

export default QuoteAndAuthor;
