import React, { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";
import useKeyboard from "../hooks/useKeyboard";

const TestScreen = () => {
  // Logic
  const [text, setText] = useState<string>("");
  const inputRef = useRef<TextInput>(null);
  const keyboardHeight = useKeyboard();

  useEffect(() => {
    console.log("📏 현재 키보드 높이:", keyboardHeight);
  }, [keyboardHeight]);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus(); // 컴포넌트가 렌더링되면 자동 포커스
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // View
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <TextInput ref={inputRef} value={text} onChangeText={setText} />
    </View>
  );
};

export default TestScreen;
