import { useEffect, useState } from "react";

type Listener = (msg: string) => void;
const listeners = new Set<Listener>();

export function showToast(msg: string) {
  listeners.forEach((l) => l(msg));
}

export function Toast() {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const listener: Listener = (m) => {
      clearTimeout(timer);
      setShow(false);
      setTimeout(() => {
        setMsg(m);
        setShow(true);
        timer = setTimeout(() => setShow(false), 3000);
      }, 50);
    };
    listeners.add(listener);
    return () => {
      clearTimeout(timer);
      listeners.delete(listener);
    };
  }, []);

  return <div className={`toast${show ? " show" : ""}`}>{msg}</div>;
}
