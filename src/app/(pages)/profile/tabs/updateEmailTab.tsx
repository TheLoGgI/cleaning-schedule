"use client"
import { TabPanel } from "@/app/components/Tab";
import { useFormState } from "react-dom";
import { updateUserEmail } from "@/app/server/actions/profile/updateUserEmail";
import { AccountUserData } from "../page";
import { PendingButton } from "@/app/components/signInOut/pendingButton";



const initialState = {
    status: 0,
    body: 'Email updated',
}


export function UpdateEmailTab({ user }: { user: AccountUserData }) {
    const [state, formAction] = useFormState(updateUserEmail, initialState)

    return (
        <TabPanel >
            <form action={formAction} className="rounded-lg border bg-card text-card-foreground shadow-sm" >
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Update Email</h3>
                    <p className="text-sm text-muted-foreground">Here you can update your email, used for your account</p>
                </div>
                <div className="p-6 space-y-4 max-w-md">
                    <div className="space-y-2">
                        <label
                            className="form-control w-full max-w-xs"
                            htmlFor="current-email"
                        >
                            Email
                        </label>
                        <input
                            className="input input-bordered w-full"
                            id="current-email"
                            name="email"
                            defaultValue={user?.email}
                            type="email"
                            required
                        />
                    </div>
                </div>
                <div className="flex items-center p-6">
                    <PendingButton
                        type="submit"
                        className="btn block text-white bg-blue-700 enabled:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  disabled:bg-gray-400 disabled:cursor-not-allowed"
                        loading={<span className="text-black">Updating...</span>}
                    >
                        Update Email
                    </PendingButton>
                    {state.status === 200 && <p className="px-6">Email updated</p>}
                </div>
            </form>

        </TabPanel>
    )
}