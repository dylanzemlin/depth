import Button from "@/components/buttons/button";
import useSwitch from "@/lib/hooks/useSwitch";
import { useEffect, useState } from "react";
import Modal from "../modal";
import { Account, Category, TransactionStatus } from "@prisma/client";
import { Select, SelectItem } from "@tremor/react";
import { FaArrowsLeftRight } from "react-icons/fa6";
import toast from "react-hot-toast";

type ImportTransactionsModalProps = {
    button?: React.ReactNode;
    disabled?: boolean;
    accounts: Account[];
    categories: Category[];
}

export default function ImportTransactionsModal(props: ImportTransactionsModalProps) {
    const sw = useSwitch(false);
    const [loading, setLoading] = useState(false);

    const [file, setFile] = useState<File | undefined>();
    const [columns, setColumns] = useState<string[]>([]);

    const [account, setAccount] = useState<Account>(props.accounts[0]);
    const [category, setCategory] = useState<Category>(props.categories[0]);
    const [status, setStatus] = useState<TransactionStatus>("CLEARED");
    const [descriptionColumn, setDescriptionColumn] = useState<string>("");
    const [amountColumn, setAmountColumn] = useState<string>("");
    const [dateColumn, setDateColumn] = useState<string>("");

    useEffect(() => {
        setFile(undefined);
        setColumns([]);
        setAccount(props.accounts[0]);
        setCategory(props.categories[0]);
        setStatus("CLEARED");
        setDescriptionColumn("");
        setAmountColumn("");
        setDateColumn("");
    }, [sw.state]);

    useEffect(() => {
        if (file == undefined) {
            return;
        }

        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = (e.target?.result as string).split("\n");
            const headers = text[0].split(",");
            setColumns(headers);
            setLoading(false);
        }
        reader.readAsText(file);
    }, [file])

    const isValidColumns = () => {
        // Ensure all columns are unique and not empty
        if (descriptionColumn === "" || amountColumn === "" || dateColumn === "") {
            return false;
        }

        return [descriptionColumn, amountColumn, dateColumn].every((value, index, self) => self.indexOf(value) === index);
    }

    const cleanRow = (row: string | undefined): string => {
        if (row == undefined)
        {
            return "";
        }

        // Remove quotes
        return row.replace(/['"]+/g, '');
    }

    const impor = async () => {
        // Validate
        if (!isValidColumns() || file == undefined) {
            return;
        }

        // Read file
        setLoading(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = (e.target?.result as string).split("\n");
            const headers = text[0].split(",");
            const transactions = text.slice(1).filter((x) => {
                return x.trim().length > 0;
            }).map((line) => {
                const values = line.split(",");
                return {
                    description: cleanRow(values[headers.indexOf(descriptionColumn)]),
                    amount: parseFloat(values[headers.indexOf(amountColumn)]),
                    date: new Date(values[headers.indexOf(dateColumn)]),
                    accountId: account.id,
                    categoryId: category.id,
                    status: status
                }
            });

            // Create transactions
            const result = await fetch("/api/v1/transaction/batch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transactions)
            });

            if (result.status === 201) {
                toast.success("Transactions imported successfully");
            } else {
                toast.error("Failed to import transactions");
            }

            setLoading(false);
            sw.setFalse();
        }
        reader.readAsText(file);
    }

    return (
        <>
            <button disabled={props.disabled} className="rounded-md border border-gray-300 px-2 py-1.5 hover:bg-gray-50 outline outline-offset-2 outline-0 focus-visible:outline-2 outline-indigo-500 flex gap-1 items-center disabled:opacity-50" onClick={sw.setTrue}>
                <span aria-hidden="true">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" aria-hidden="true" className="size-5 -ml-px shrink-0 transition sm:size-4">
                        <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                    </svg>
                </span>
                Import
            </button>
            <Modal isOpen={sw.state} onClose={sw.setFalse} title="Import Transactions" footer={
                <div className="flex justify-start gap-2">
                    <Button color="violet" size="sm" title="Import" onClick={impor} loading={loading} disabled={loading || file == null || !isValidColumns()} />
                    <Button color="slate" size="sm" title="Cancel" onClick={sw.setFalse} disabled={loading} />
                </div>
            }>
                {file == null && (
                    <>
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0])} />
                            </label>
                        </div>
                    </>
                )}

                {file != null && (
                    <>
                        <div>
                            <label htmlFor="account" className="block text-sm font-medium text-gray-700">
                                Account
                            </label>
                            <Select id="account" name="account" value={account.id} onValueChange={(e) => setAccount(props.accounts.find((a) => a.id === e) as Account)}>
                                {
                                    props.accounts.map((account) => {
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
                            <Select id="category" name="category" value={category.id} onValueChange={(e) => setCategory(props.categories.find((c) => c.id === e) as Category)}>
                                {
                                    props.categories.map((category) => {
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
                            <Select id="status" name="status" value={status} onValueChange={(e) => setStatus(e as TransactionStatus)}>
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

                        {/* Mappings */}
                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium text-gray-700">
                                CSV Mappings
                            </label>

                            <div className="flex w-full items-center gap-8">
                                <div className="w-full">
                                    <label className="block text-xs font-medium text-gray-700">
                                        Description
                                    </label>
                                    <Select id="description_csv" name="description_csv" value={descriptionColumn} onValueChange={(e) => setDescriptionColumn(e)}>
                                        {
                                            columns.map((column) => {
                                                return (
                                                    <SelectItem key={column} value={column}>
                                                        {column}
                                                    </SelectItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>

                            <div className="flex w-full justify-between items-center gap-8">
                                <div className="w-full">
                                    <label className="block text-xs font-medium text-gray-700">
                                        Amount
                                    </label>
                                    <Select id="amount_csv" name="amount_csv" value={amountColumn} onValueChange={(e) => setAmountColumn(e)}>
                                        {
                                            columns.map((column) => {
                                                return (
                                                    <SelectItem key={column} value={column}>
                                                        {column}
                                                    </SelectItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>

                            <div className="flex w-full justify-between items-center gap-8">
                                <div className="w-full">
                                    <label className="block text-xs font-medium text-gray-700">
                                        Date
                                    </label>
                                    <Select id="date_csv" name="date_csv" value={dateColumn} onValueChange={(e) => setDateColumn(e)}>
                                        {
                                            columns.map((column) => {
                                                return (
                                                    <SelectItem key={column} value={column}>
                                                        {column}
                                                    </SelectItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Modal>
        </>
    )
}