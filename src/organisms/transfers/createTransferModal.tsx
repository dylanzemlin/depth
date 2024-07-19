import { getAccounts } from "@/lib/api/accounts";
import { getCategories } from "@/lib/api/categories";
import { createTransfer, CreateTransferData } from "@/lib/api/transfers";
import useEditObject from "@/lib/hooks/useEditObject";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import Modal from "@/molecules/modals/modal";
import { Account, Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import toast from "react-hot-toast";
import { FaArrowRight } from "react-icons/fa6";

type CreateTransferModalProps = {
    button?: React.ReactNode;
    accounts?: Account[];
    categories?: Category[];

    defaultFromAccountId?: string;
    defaultToAccountId?: string;
}

export default function CreateTransferModal(props?: CreateTransferModalProps) {
    const sw = useSwitch(false);
    const createMutation = useEditObject<CreateTransferData>({
        mutationFn: createTransfer, initialData: {
            fromAccountId: props?.defaultFromAccountId,
            toAccountId: props?.defaultToAccountId,
            status: "CLEARED",
            date: new Date()
        }, invalidateQueries: { queryKey: ["transfers"] }
    });

    const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories, enabled: props?.categories == undefined });
    const accountsQuery = useQuery({ queryKey: ["accounts"], queryFn: getAccounts, enabled: props?.accounts == undefined });

    const accounts = props?.accounts ?? accountsQuery.data?.data;
    const categories = props?.categories ?? categoriesQuery.data?.data;

    const canCreate = createMutation.data?.fromAccountId != undefined && createMutation.data?.toAccountId != undefined && createMutation.data?.amount != undefined;
    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Create Transfer" onClick={sw.setTrue} />
                )
            }
            <Modal isOpen={sw.state} onClose={sw.setFalse} title="Create Transfer" footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Create"
                        onClick={async () => {
                            try {
                                await createMutation.mutate(true)
                                toast.success("Transfer created successfully")
                                sw.setFalse()
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
                <div className="w-full flex flex-col">
                    <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700">
                        Accounts
                    </label>
                    <div className="flex gap-4 items-center w-full">
                        <Select id="fromAccount" name="fromAccount" value={createMutation.data.fromAccountId} onValueChange={(e) => createMutation.setProperty("fromAccountId", e)}>
                            {
                                accounts?.filter(x => x.id != createMutation.data.toAccountId)?.map((account) => {
                                    return (
                                        <SelectItem key={account.id} value={account.id}>
                                            {account.name} ({account.type})
                                        </SelectItem>
                                    )
                                })
                            }
                        </Select>
                        <FaArrowRight className="text-4xl text-gray-700" />
                        <Select id="toAccount" name="toAccount" value={createMutation.data.toAccountId} onValueChange={(e) => createMutation.setProperty("toAccountId", e)}>
                            {
                                accounts?.filter(x => x.id != createMutation.data.fromAccountId)?.map((account) => {
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
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Date
                    </label>
                    <DatePicker id="date" value={createMutation.data.date} onValueChange={(e) => createMutation.setProperty("date", new Date(e?.toUTCString() ?? new Date().toUTCString()))} />
                </div>
            </Modal>
        </>
    )
}