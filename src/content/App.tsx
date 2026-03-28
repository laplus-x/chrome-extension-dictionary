import {
  useSearchState,
  withAsyncStorageProvider,
  withConfigProvider,
} from "@/components/repository/storage";
import { Button } from "@/components/ui/button";
import "@/index.css";
import styles from "@/index.css?inline";
import { cn } from "@/lib";
import {
  useClientPoint,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { SearchIcon } from "lucide-react";
import { type ComponentType, useEffect, useState } from "react";
import root from "react-shadow";
import { useDebounceValue } from "usehooks-ts";

interface SelectionState {
  hasSelection: boolean;
  content: string;
  coords: { x: number | null; y: number | null };
}

const useSelection = () => {
  const [state, setState] = useDebounceValue<SelectionState>(
    {
      hasSelection: false,
      content: "",
      coords: { x: null, y: null },
    },
    200,
  );

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();

      const content = selection?.toString().trim();

      if (!selection || selection.isCollapsed || !content) {
        setState({
          hasSelection: false,
          content: "",
          coords: { x: null, y: null },
        });
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      setState({
        hasSelection: true,
        content,
        coords: {
          x: rect.left + rect.width / 2,
          y: rect.top,
        },
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [setState]);

  return state;
};

function App() {
  const { hasSelection, content, coords } = useSelection();
  const [visible, setVisible] = useState<boolean>(false);
  const [text, setText] = useSearchState("");

  const { refs, floatingStyles, context } = useFloating({
    open: visible,
    onOpenChange: setVisible,
  });

  const offset = 20;
  const clientPoint = useClientPoint(context, {
    x: coords.x,
    y: (coords.y ?? 0) + offset,
    enabled: coords.x !== null && coords.y !== null,
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    clientPoint,
  ]);

  useEffect(() => {
    setVisible(hasSelection);
  }, [hasSelection]);

  const handleClick = () => {
    setText(content);
    setVisible(false);
    chrome.runtime.sendMessage({ type: "OPEN_SIDE_PANEL" });
  };

  return (
    <div ref={refs.setReference} {...getReferenceProps()}>
      {visible && (
        <Button
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className={cn("rounded-full", "transition-none")}
          size="icon"
          onClick={handleClick}
        >
          <SearchIcon />
        </Button>
      )}
    </div>
  );
}

const withShadow = (Component: ComponentType) => {
  return function WrappedComponent() {
    return (
      <root.div>
        <style type="text/css">{styles.toString()}</style>
        <Component />
      </root.div>
    );
  };
};

export default withShadow(withAsyncStorageProvider(withConfigProvider(App)));
