import { getAccounts } from "@/lib/api/accounts";
import { getCategories } from "@/lib/api/categories";
import { CreateSubscriptionData, EditSubscriptionData, createSubscription, editSubscription } from "@/lib/api/subscriptions";
import useEditObject from "@/lib/hooks/useEditObject";
import useSwitch from "@/lib/hooks/useSwitch";
import Button from "@/molecules/buttons/button";
import Modal from "@/molecules/modals/modal";
import { Account, Category, Subscription } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { DatePicker, NumberInput, Select, SelectItem, TextInput } from "@tremor/react";
import { DateTime } from "luxon";
import toast from "react-hot-toast";

type EditSubscriptionModalProps = {
    button?: React.ReactNode;
    accounts?: Account[];
    categories?: Category[];
    subscription: Subscription;
}

export default function EditSubscriptionModal(props: EditSubscriptionModalProps) {
    const sw = useSwitch(false);
    const updateMutation = useEditObject<EditSubscriptionData>({ mutationFn: editSubscription, initialData: {
        accountId: props.subscription.accountId,
        categoryId: props.subscription.categoryId,
        frequency: props.subscription.frequency,
        startDate: DateTime.fromJSDate(new Date(props.subscription.startDate)),
        endDate: props.subscription.endDate ? DateTime.fromJSDate(new Date(props.subscription.endDate)) : undefined,
        amount: props.subscription.amount,
        description: props.subscription.description,
        id: props.subscription.id
    }, invalidateQueries: { queryKey: ["subscriptions"] } });

    const categoriesQuery = useQuery({ queryKey: ["categories"], queryFn: getCategories, enabled: props?.categories == undefined });
    const accountsQuery = useQuery({ queryKey: ["accounts"], queryFn: getAccounts, enabled: props?.accounts == undefined });

    const accounts = props?.accounts ?? accountsQuery.data?.data;
    const categories = props?.categories ?? categoriesQuery.data?.data;

    const canSave = updateMutation.data?.accountId != props.subscription.accountId || updateMutation.data?.categoryId != props.subscription.categoryId || updateMutation.data?.frequency != props.subscription.frequency || updateMutation.data?.amount != props.subscription.amount || updateMutation.data?.description != props.subscription.description;
    return (
        <>
            {
                props?.button ? (
                    <div onClick={sw.setTrue}>
                        {props.button}
                    </div>
                ) : (
                    <Button color="violet" title="Edit Subscription" onClick={sw.setTrue} />
                )
            }
            <Modal isOpen={sw.state} onClose={sw.setFalse} title="Edit Subscription" footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Save"
                        onClick={async () => {
                            try {
                                await updateMutation.mutate(true)
                                toast.success("Subscription created successfully")
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
                <div>
                    <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                        Account
                    </label>
                    <Select id="account" name="account" value={updateMutation.data.accountId} onValueChange={(e) => updateMutation.setProperty("accountId", e)}>
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
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                        Frequency
                    </label>
                    <Select id="frequency" name="frequency" value={updateMutation.data.frequency} onValueChange={(e) => updateMutation.setProperty("frequency", e)}>
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
                    <TextInput id="description" name="description" placeholder="Description" value={updateMutation.data.description} onValueChange={(e) => updateMutation.setProperty("description", e)} />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Amount
                    </label>
                    <NumberInput id="amount" name="amount" value={updateMutation.data.amount} onValueChange={(e) => updateMutation.setProperty("amount", e)} enableStepper={false} placeholder="Amount" />
                </div>
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                        Start Date
                    </label>
                    <DatePicker id="startDate" placeholder="Start Date" value={updateMutation.data.startDate?.toJSDate()} onValueChange={(e) => updateMutation.setProperty("startDate", DateTime.fromISO(e?.toISOString() ?? DateTime.local().toISO()))} />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                        End Date
                    </label>
                    <DatePicker id="endDate" placeholder="End Date" value={updateMutation.data.endDate?.toJSDate()} onValueChange={(e) => updateMutation.setProperty("endDate", DateTime.fromISO(e?.toISOString() ?? DateTime.local().toISO()))} />
                </div>
            </Modal>
        </>
    )
}