import { EditTransactionData, updateTransaction } from "@/lib/api/transactions";
import useEditObject from "@/lib/hooks/useEditObject";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import Modal from "@/molecules/modals/modal";
import { Account, Category, Transaction } from "@prisma/client";
import { DatePicker, NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import { DateTime } from "luxon";
import toast from "react-hot-toast";

type EditTransactionModalProps = {
    button?: React.ReactNode;
    accounts?: Account[];
    categories?: Category[];
    transaction: Transaction;
}

export default function EditTransactionModal(props: EditTransactionModalProps) {
    const sw = useSwitch(false);
    const editMutation = useEditObject<EditTransactionData>({ mutationFn: updateTransaction, initialData: {
        ...props.transaction,
        date: DateTime.fromJSDate(new Date(props.transaction.date))
    }, invalidateQueries: { queryKey: ["transactions"] } });

    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Edit Transaction" onClick={sw.setTrue} />
                )
            }
            <Modal isOpen={sw.state} onClose={sw.setFalse} title="Edit Transaction" footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Save"
                        onClick={async () => {
                            try {
                                await editMutation.mutate(true)
                                toast.success("Transaction saved successfully")
                                sw.setFalse()
                            } catch (error: any) {
                                toast.error(error)
                            }
                        }}
                        loading={editMutation.isPending}
                        disabled={editMutation.data == null} />
                    <Button color="slate" size="sm" title="Cancel"
                        onClick={sw.setFalse}
                        disabled={editMutation.isPending} />
                </div>
            }>
                <div>
                    <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                        Account
                    </label>
                    <Select id="account" name="account" value={editMutation.data.accountId} onValueChange={(e) => editMutation.setProperty("accountId", e)}>
                        {
                            props?.accounts?.map((account) => {
                                return (
                                    <SelectItem key={account.id} value={account.id}>
                                        {account.name} ({account.type})
                                    </SelectItem>
                                )
                            })
                        }
                    </Select>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <Select id="category" name="category" value={editMutation.data.categoryId} onValueChange={(e) => editMutation.setProperty("categoryId", e)}>
                        {
                            props?.categories?.filter(x => !x.archived)?.map((category) => {
                                return (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.title}
                                    </SelectItem>
                                )
                            })
                        }
                    </Select>
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <Select id="status" name="status" value={editMutation.data.status} onValueChange={(e) => editMutation.setProperty("status", e)}>
                        <SelectItem value="CLEARED">
                            Cleared
                        </SelectItem>
                        <SelectItem value="PENDING">
                            Pending
                        </SelectItem>
                        <SelectItem value="CANCELLED">
                            Cancelled
                        </SelectItem>
                    </Select>
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Type
                    </label>
                    <Select id="type" name="type" value={editMutation.data.type} onValueChange={(e) => editMutation.setProperty("type", e)}>
                        <SelectItem value="INCOME">
                            Income
                        </SelectItem>
                        <SelectItem value="EXPENSE">
                            Expense
                        </SelectItem>
                    </Select>
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <TextInput id="description" name="description" placeholder="Description" value={editMutation.data.description} onValueChange={(e) => editMutation.setProperty("description", e)} />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount
                    </label>
                    <NumberInput id="amount" name="amount" value={editMutation.data.amount} onValueChange={(e) => editMutation.setProperty("amount", e)} enableStepper={false} placeholder="Amount" />
                </div>
                <div>
                    <label htmlFor="Date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <DatePicker id="date" value={editMutation.data.date?.toJSDate()} onValueChange={(e) => editMutation.setProperty("date", DateTime.fromISO(e?.toISOString() ?? DateTime.local().toISO()))} />
                </div>
            </Modal>
        </>
    )
}