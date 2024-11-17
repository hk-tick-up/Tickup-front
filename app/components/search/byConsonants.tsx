"use client";

import { useState } from "react";
import Alphabet from "./alphabet";
import Korean from "./korean";

export default function ByConsonants() {
  const [language, setLanguage] = useState<boolean>(true);

  const onSwitchLanguage = () => {
    setLanguage(!language);
  };

  return (
    <div className="flex">
      <button title="switchLanguage" onClick={onSwitchLanguage} className="w-10 h-6 border border-black">가/A</button>
      {language ? <Korean /> : <Alphabet />}
    </div>
  );
}
