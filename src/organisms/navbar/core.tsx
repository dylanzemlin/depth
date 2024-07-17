import useSwitch from "@/lib/hooks/useSwitch";
import DesktopNav from "./desktop";
import MobileNav from "./mobile";
import Modal from "@/molecules/modals/modal";
import Button from "@/molecules/buttons/button";
import { NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import { useEffect, useState } from "react";
import { Account, AccountType } from "@prisma/client";
import toast from "react-hot-toast";
import { FaCoins, FaCreditCard, FaVectorSquare } from "react-icons/fa6";

export const accountTypeToIcon = (type: AccountType) => {
    switch (type) {
        case AccountType.CHECKINGS:
            return <FaCoins />;
        case AccountType.SAVINGS:
            return <FaCoins />;
        case AccountType.CREDIT:
            return <FaCreditCard />;
        default:
            return <FaVectorSquare />;
    }
}

export const accountTypeToDisplayName = (type: AccountType) => {
    switch (type) {
        case AccountType.CHECKINGS:
            return "Checkings";
        case AccountType.SAVINGS:
            return "Savings";
        case AccountType.CREDIT:
            return "Credit";
        default:
            return "Other";
    }
}

export default function Navbar() {
    const createAccountSwitch = useSwitch(false);
    const [accountName, setAccountName] = useState("");
    const [accountType, setAccountType] = useState("savings");
    const [accountBalance, setAccountBalance] = useState<number | undefined>(undefined);
    const [accountCreditLimit, setAccountCreditLimit] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);

    const createAccount = async () => {
        if (loading) return;

        setLoading(true);
        const res = await fetch("/api/v1/account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: accountName,
                type: accountType,
                balance: accountBalance,
                creditLimit: accountCreditLimit
            })
        });

        if (res.status != 201) {
            toast.error("Failed to create account");
            setLoading(false);
            return;
        }

        toast.success(`Account "${accountName}" created`);
        await loadAccounts();
        setLoading(false);
        createAccountSwitch.setFalse();
    }

    const loadAccounts = async () => {
        const res = await fetch("/api/v1/account/list");
        if (res.status !== 200) {
            toast.error("Failed to load accounts");
            return;
        }

        const accounts = await res.json();
        setAccounts(accounts.data);
    }

    useEffect(() => {
        loadAccounts();
    }, []);

    return (
        <nav className="border-gray-200 border min-w-64 p-2 px-4">
            <DesktopNav onAccountModalOpen={createAccountSwitch.setTrue} accounts={accounts} />
            <MobileNav onAccountModalOpen={createAccountSwitch.setTrue} accounts={accounts} />

            <Modal title="Create Account" isOpen={createAccountSwitch.state} onClose={createAccountSwitch.setFalse} footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Create" onClick={createAccount} loading={loading} disabled={accountName.length <= 0} />
                    <Button color="slate" size="sm" title="Cancel" onClick={createAccountSwitch.setFalse} disabled={loading} />
                </div>
            }>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <TextInput id="title" title="Title" value={accountName} onValueChange={(e) => setAccountName(e)} placeholder="Name" />
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Account Type
                    </label>
                    <Select id="type" title="Title" value={accountType} onValueChange={(e) => setAccountType(e)} placeholder="Type">
                        <SelectItem value="savings">Savings</SelectItem>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </Select>
                </div>
                <div>
                    <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
                        Initial Balance
                    </label>
                    <NumberInput id="balance" title="Balance" value={accountBalance} onValueChange={(e) => setAccountBalance(e)} placeholder="$1000" enableStepper={false} />
                </div>
                {
                    accountType == "credit" && (
                        <div>
                            <label htmlFor="limit" className="block text-sm font-medium text-gray-700">
                                Credit Limit
                            </label>
                            <NumberInput id="limit" title="Credit Limit" value={accountCreditLimit} min={0} onValueChange={(e) => setAccountCreditLimit(e)} placeholder="$1000" enableStepper={false} />
                        </div>
                    )
                }
            </Modal>
        </nav>
    )
}