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
import { DateTime } from "luxon";
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
    const updateMutation = useEditObject<EditTransferData>({
        mutationFn: updateTransfer, initialData: {
            fromAccountId: props.transfer.fromAccountId,
            toAccountId: props.transfer.toAccountId,
            categoryId: props.transfer.categoryId,
            status: props.transfer.status,
            description: props.transfer.description,
            amount: props.transfer.amount,
            date: DateTime.fromJSDate(new Date(props.transfer.date)),
            id: props.transfer.id
        }, invalidateQueries: { predicate: (query) => query.queryKey[0] == "transfers" || query.queryKey[0] == "transactions" }
    });

    const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories, enabled: props?.categories == undefined });
    const accountsQuery = useQuery({ queryKey: ["accounts"], queryFn: getAccounts, enabled: props?.accounts == undefined });

    const accounts = props?.accounts ?? accountsQuery.data?.data;
    const categories = props?.categories ?? categoriesQuery.data?.data;

    const canSave = updateMutation.data?.fromAccountId != props.transfer.fromAccountId || updateMutation.data?.toAccountId != props.transfer.toAccountId || updateMutation.data?.categoryId != props.transfer.categoryId || updateMutation.data?.status != props.transfer.status || updateMutation.data?.description != props.transfer.description || updateMutation.data?.amount != props.transfer.amount;
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
                                await updateMutation.mutate(true)
                                toast.success("Transfer edited successfully")
                                sw.setFalse()
                            } catch (error: any) {
                                toast.error(error.message)
                            }
                        }}
                        loading={updateMutation.isPending}
                        disabled={!canSave} />
                    <Button color="slate" size="sm" title="Cancel"
                        onClick={sw.setFalse}
                        disabled={updateMutation.isPending} />
                </div>
            }>
                <div className="w-full flex flex-col">
                    <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700">
                        Accounts
                    </label>
                    <div className="flex gap-4 items-center w-full">
                        <Select id="fromAccount" name="fromAccount" value={updateMutation.data.fromAccountId} onValueChange={(e) => updateMutation.setProperty("fromAccountId", e)}>
                            {
                                accounts?.filter(x => x.id != updateMutation.data.toAccountId)?.map((account) => {
                                    return (
                                        <SelectItem key={account.id} value={account.id}>
                                            {account.name} ({account.type})
                                        </SelectItem>
                                    )
                                })
                            }
                        </Select>
                        <FaArrowRight className="text-4xl text-gray-700" />
                        <Select id="toAccount" name="toAccount" value={updateMutation.data.toAccountId} onValueChange={(e) => updateMutation.setProperty("toAccountId", e)}>
                            {
                                accounts?.filter(x => x.id != updateMutation.data.fromAccountId)?.map((account) => {
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
                    <Select id="category" name="category" value={updateMutation.data.categoryId} onValueChange={(e) => updateMutation.setProperty("categoryId", e)}>
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
                    <Select id="status" name="status" value={updateMutation.data.status} onValueChange={(e) => updateMutation.setProperty("status", e)}>
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
                    <TextInput id="description" name="description" placeholder="Description" value={updateMutation.data.description} onValueChange={(e) => updateMutation.setProperty("description", e)} />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount
                    </label>
                    <NumberInput id="amount" name="amount" value={updateMutation.data.amount} onValueChange={(e) => updateMutation.setProperty("amount", e)} enableStepper={false} placeholder="Amount" />
                </div>
                <div>
                    <label htmlFor="Date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <DatePicker id="date" value={updateMutation.data.date?.toJSDate()} onValueChange={(e) => updateMutation.setProperty("date", DateTime.fromISO(e?.toISOString() ?? DateTime.local().toISO()))} />
                </div>
            </Modal>
        </>
    )
}