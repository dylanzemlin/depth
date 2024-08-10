import { getAccounts } from "@/lib/api/accounts";
import { getCategories } from "@/lib/api/categories";
import { CreateTransactionData, createTransaction } from "@/lib/api/transactions";
import useEditObject from "@/lib/hooks/useEditObject";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import Modal from "@/molecules/modals/modal";
import { Account, Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import { DateTime } from "luxon";
import toast from "react-hot-toast";

type CreateTransactionModalProps = {
    button?: React.ReactNode;
    accounts?: Account[];
    categories?: Category[];

    defaultAccountId?: string;
    defaultCategoryId?: string;
    defaultStatus?: "CLEARED" | "PENDING" | "CANCELLED";
    defaultType?: "INCOME" | "EXPENSE";

    onTransactionCreated?: () => void;
}

export default function CreateTransactionModal(props?: CreateTransactionModalProps) {
    const sw = useSwitch(false);
    const createMutation = useEditObject<CreateTransactionData>({ mutationFn: createTransaction, initialData: {
        accountId: props?.defaultAccountId,
        categoryId: props?.defaultCategoryId,
        status: props?.defaultStatus,
        type: props?.defaultType,
        date: DateTime.local()
    }, invalidateQueries: { queryKey: ["transactions"] } });

    const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories, enabled: props?.categories == undefined });
    const accountsQuery = useQuery({ queryKey: ["accounts"], queryFn: getAccounts, enabled: props?.accounts == undefined });

    const accounts = props?.accounts ?? accountsQuery.data?.data;
    const categories = props?.categories ?? categoriesQuery.data?.data;

    const canCreate = createMutation.data?.accountId != null && createMutation.data?.categoryId != null && createMutation.data?.status != null && createMutation.data?.type != null && createMutation.data?.amount != null && createMutation.data?.date != null;
    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Create Transaction" onClick={sw.setTrue} />
                )
            }
            <Modal isOpen={sw.state} onClose={sw.setFalse} title="Create Transaction" footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Create"
                        onClick={async () => {
                            try {
                                await createMutation.mutate(true)
                                toast.success("Transaction created successfully")
                                sw.setFalse()
                                props?.onTransactionCreated?.()
                            } catch (error: any) {
                                toast.error(error.message)
                            }
                        }}
                        loading={createMutation.isPending}
                        disabled={!canCreate} />
                    <Button color="slate" size="sm" title="Cancel"
                        onClick={sw.setFalse}
                        disabled={createMutation.isPending} />
                </div>
            }>
                <div>
                    <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                        Account
                    </label>
                    <Select id="account" name="account" value={createMutation.data.accountId} onValueChange={(e) => createMutation.setProperty("accountId", e)}>
                        {
                            accounts?.map((account) => {
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
                    <Select id="category" name="category" value={createMutation.data.categoryId} onValueChange={(e) => createMutation.setProperty("categoryId", e)}>
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
                    <Select id="status" name="status" value={createMutation.data.status} onValueChange={(e) => createMutation.setProperty("status", e)}>
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
                    <Select id="type" name="type" value={createMutation.data.type} onValueChange={(e) => createMutation.setProperty("type", e)}>
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
                    <TextInput id="description" name="description" placeholder="Description" value={createMutation.data.description} onValueChange={(e) => createMutation.setProperty("description", e)} />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount
                    </label>
                    <NumberInput id="amount" name="amount" value={createMutation.data.amount} onValueChange={(e) => createMutation.setProperty("amount", e)} enableStepper={false} placeholder="Amount" />
                </div>
                <div>
                    <label htmlFor="Date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <DatePicker id="date" value={createMutation.data.date?.toJSDate()} onValueChange={(e) => createMutation.setProperty("date", DateTime.fromISO(e?.toISOString() ?? DateTime.local().toISO()))} />
                </div>
            </Modal>
        </>
    )
}