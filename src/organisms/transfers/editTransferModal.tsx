import { getAccounts } from "@/lib/api/accounts";
import { getCategories } from "@/lib/api/categories";
import { EditTransferData, updateTransfer } from "@/lib/api/transfers";
import useEditObject from "@/lib/hooks/useEditObject";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import Modal from "@/molecules/modals/modal";
import { Account, Category, Transfer } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import toast from "react-hot-toast";
import { FaArrowRight } from "react-icons/fa6";

type CreateTransferModalProps = {
    button?: React.ReactNode;
    accounts?: Account[];
    categories?: Category[];
    transfer: Transfer;
}

export default function EditTransferModal(props: CreateTransferModalProps) {
    const sw = useSwitch(false);
    const editMutation = useEditObject<EditTransferData>({
        mutationFn: updateTransfer, initialData: {
            fromAccountId: props.transfer.fromAccountId,
            toAccountId: props.transfer.toAccountId,
            categoryId: props.transfer.categoryId,
            status: props.transfer.status,
            description: props.transfer.description,
            amount: props.transfer.amount,
            date: props.transfer.date,
            id: props.transfer.id
        }, invalidateQueries: { predicate: (query) => query.queryKey[0] == "transfers" || query.queryKey[0] == "transactions" }
    });

    const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories, enabled: props?.categories == undefined });
    const accountsQuery = useQuery({ queryKey: ["accounts"], queryFn: getAccounts, enabled: props?.accounts == undefined });

    const accounts = props?.accounts ?? accountsQuery.data?.data;
    const categories = props?.categories ?? categoriesQuery.data?.data;

    const canSave = editMutation.data?.fromAccountId != props.transfer.fromAccountId || editMutation.data?.toAccountId != props.transfer.toAccountId || editMutation.data?.categoryId != props.transfer.categoryId || editMutation.data?.status != props.transfer.status || editMutation.data?.description != props.transfer.description || editMutation.data?.amount != props.transfer.amount || editMutation.data?.date != props.transfer.date;
    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Edit Transfer" onClick={sw.setTrue} />
                )
            }
            <Modal isOpen={sw.state} onClose={sw.setFalse} title="Edit Transfer" footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Save"
                        onClick={async () => {
                            try {
                                await editMutation.mutate(true)
                                toast.success("Transfer edited successfully")
                                sw.setFalse()
                            } catch (error: any) {
                                toast.error(error.message)
                            }
                        }}
                        loading={editMutation.isPending}
                        disabled={!canSave} />
                    <Button color="slate" size="sm" title="Cancel"
                        onClick={sw.setFalse}
                        disabled={editMutation.isPending} />
                </div>
            }>
                <div className="w-full flex flex-col">
                    <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700">
                        Accounts
                    </label>
                    <div className="flex gap-4 items-center w-full">
                        <Select id="fromAccount" name="fromAccount" value={editMutation.data.fromAccountId} onValueChange={(e) => editMutation.setProperty("fromAccountId", e)}>
                            {
                                accounts?.filter(x => x.id != editMutation.data.toAccountId)?.map((account) => {
                                    return (
                                        <SelectItem key={account.id} value={account.id}>
                                            {account.name} ({account.type})
                                        </SelectItem>
                                    )
                                })
                            }
                        </Select>
                        <FaArrowRight className="text-4xl text-gray-700" />
                        <Select id="toAccount" name="toAccount" value={editMutation.data.toAccountId} onValueChange={(e) => editMutation.setProperty("toAccountId", e)}>
                            {
                                accounts?.filter(x => x.id != editMutation.data.fromAccountId)?.map((account) => {
                                    return (
                                        <SelectItem key={account.id} value={account.id}>
                                            {account.name} ({account.type})
                                        </SelectItem>
                                    )
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <Select id="category" name="category" value={editMutation.data.categoryId} onValueChange={(e) => editMutation.setProperty("categoryId", e)}>
                        {
                            categories?.filter(x => !x.archived)?.map((category) => {
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
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <DatePicker id="date" value={new Date(editMutation.data.date ?? new Date())} onValueChange={(e) => editMutation.setProperty("date", new Date(e?.toString() ?? new Date().toString()))} />
                </div>
            </Modal>
        </>
    )
}