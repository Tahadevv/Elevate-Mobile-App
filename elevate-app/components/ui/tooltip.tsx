import * as React from "react";
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle
} from "react-native";

export interface TooltipProps {
  children: React.ReactNode;
}

export interface TooltipTriggerProps {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
  style?: ViewStyle;
}

export interface TooltipContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const Tooltip: React.FC<TooltipProps> = ({ children }) => {
  return <>{children}</>;
};

const TooltipTrigger: React.FC<TooltipTriggerProps> = ({
  children,
  tooltipContent,
  style,
}) => {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const handlePressIn = () => {
    setShowTooltip(true);
  };

  const handlePressOut = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <TouchableOpacity
        style={style}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>

      <Modal
        visible={showTooltip}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTooltip(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.tooltipContent}>
            {tooltipContent}
          </View>
        </View>
      </Modal>
    </>
  );
};

const TooltipContent: React.FC<TooltipContentProps> = ({ children, style }) => {
  return (
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
};

const TooltipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  tooltipContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  content: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

