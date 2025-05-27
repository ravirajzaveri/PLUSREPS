interface GiftSubButtonProps {
  userId: string;
  compact?: boolean;
}

export const BitsButton = ({ userId, compact }: GiftSubButtonProps) => {
  const handleGift = () => {
    console.log("Gifting subs to:", userId);
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      className={`w-full ${compact ? "text-xs px-2 py-1" : ""}`}
      onClick={handleGift}
    >
      {compact ? "Gift" : "Gift Sub"}
    </Button>
  );
};
