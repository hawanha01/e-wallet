import React from "react";
import Skeleton from "react-loading-skeleton";
import { getCurrentUserWalletBalance } from "../../utils/wallet";
import AddAmount from "./AddAmount";

export default function Wallet(user) {
  const [wallet, setWallet] = React.useState(null);
  const [isShow, setIsShow] = React.useState(false);
  const [isAddAmountShow, setIsAddAmountShow] = React.useState(false);
  React.useEffect(() => {
    getCurrentUserWalletBalance(user).then((wallet) => setWallet(wallet));
  }, []);
  return (
    <div>
      {wallet ? (
        <div>
          <strong>Your current Balance</strong>
          {isShow ? <p>{wallet.balance}</p> : <p>****</p>}
          <button onClick={() => setIsShow(!isShow)}>
            {isShow ? "Hide amount" : "Show amount"}
          </button>
          {isAddAmountShow ? <AddAmount /> : null}
          <button onClick={() => setIsAddAmountShow(!isAddAmountShow)}>
            {isAddAmountShow ? "Back to Amount" : "Add Amount ?"}
          </button>
        </div>
      ) : (
        <div>
          <Skeleton count={5} />
        </div>
      )}
    </div>
  );
}
