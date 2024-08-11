import { getAccounts } from "@/lib/api/accounts";
import { getCategories } from "@/lib/api/categories";
import { CreateSubscriptionData, createSubscription } from "@/lib/api/subscriptions";
import useEditObject from "@/lib/hooks/useEditObject";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import Modal from "@/molecules/modals/modal";
import { Account, Category } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import { DateTime } from "luxon";
import toast from "react-hot-toast";

type CreateSubscriptionModalProps = {
    button?: React.ReactNode;
    accounts?: Account[];
    categories?: Category[];

    defaultAccountId?: string;
    defaultCategoryId?: string;
    defaultFrequency?: "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "YEARLY";
}

export default function CreateSubscriptionModal(props?: CreateSubscriptionModalProps) {
    const sw = useSwitch(false);
    const createMutation = useEditObject<CreateSubscriptionData>({ mutationFn: createSubscription, initialData: {
        accountId: props?.defaultAccountId,
        categoryId: props?.defaultCategoryId,
        startDate: DateTime.local()
    }, invalidateQueries: { queryKey: ["subscriptions"] } });

    const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories, enabled: props?.categories == undefined });
    const accountsQuery = useQuery({ queryKey: ["accounts"], queryFn: getAccounts, enabled: props?.accounts == undefined });

    const accounts = props?.accounts ?? accountsQuery.data?.data;
    const categories = props?.categories ?? categoriesQuery.data?.data;

    const canCreate = createMutation.data?.accountId != null && createMutation.data?.categoryId != null && createMutation.data?.frequency != null && createMutation.data?.startDate != null && createMutation.data?.amount != null && createMutation.data?.description != null;
    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Create Subscription" onClick={sw.setTrue} />
                )
            }
            <Modal isOpen={sw.state} onClose={sw.setFalse} title="Create Subscription" footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Create"
                        onClick={async () => {
                            try {
                                await createMutation.mutate(true)
                                toast.success("Subscription created successfully")
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
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                        Frequency
                    </label>
                    <Select id="frequency" name="frequency" value={createMutation.data.frequency} onValueChange={(e) => createMutation.setProperty("frequency", e)}>
                        <SelectItem value="DAILY">
                            Daily
                        </SelectItem>
                        <SelectItem value="WEEKLY">
                            Weekly
                        </SelectItem>
                        <SelectItem value="BIWEEKLY">
                            Biweekly
                        </SelectItem>
                        <SelectItem value="MONTHLY">
                            Monthly
                        </SelectItem>
                        <SelectItem value="YEARLY">
                            Yearly
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
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date
                    </label>
                    <DatePicker id="startDate" placeholder="Start Date" value={createMutation.data.startDate?.toJSDate()} onValueChange={(e) => createMutation.setProperty("startDate", DateTime.fromISO(e?.toISOString() ?? DateTime.local().toISO()))} />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <DatePicker id="endDate" placeholder="End Date" value={createMutation.data.endDate?.toJSDate()} onValueChange={(e) => createMutation.setProperty("endDate", DateTime.fromISO(e?.toISOString() ?? DateTime.local().toISO()))} />
                </div>
            </Modal>
        </>
    )
}