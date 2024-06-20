"use client"
import { TabPanel } from "@/app/components/Tab";
import { useFormState } from "react-dom";
import { updateUserPassword } from "@/app/server/actions/profile/updateUserPassword";
import { PendingButton } from "@/app/components/signInOut/pendingButton";



const initialState = {
    status: 0,
    body: 'Password updated',
}




export function UpdatePasswordTab() {
    const [state, formAction] = useFormState(updateUserPassword, initialState)


    return (
        <TabPanel >
            <form action={formAction} className="rounded-lg border bg-card text-card-foreground shadow-sm" >
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Update Password</h3>
                    <p className="text-sm text-muted-foreground">Change your password to secure your account.</p>
                </div>

                <div className="p-6 space-y-4 max-w-md">
                    <div className="space-y-2">
                        <label
                            className="form-control w-full max-w-xs"
                            htmlFor="new-password"
                        >
                            New Password
                        </label>
                        <input
                            className="input input-bordered w-full"
                            id="new-password"
                            name="new-password"
                            type="password"
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            className="form-control w-full max-w-xs"
                            htmlFor="confirm-password"
                        >
                            Confirm Password
                        </label>
                        <input
                            className="input input-bordered w-full"
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                        />
                    </div>
                </div>
                <div className="flex items-center p-6">
                    <PendingButton
                        type="submit"
                        className="btn block text-white bg-blue-700 enabled:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  disabled:bg-gray-400 disabled:cursor-not-allowed"
                        loading={<span className="text-black">Updating...</span>}
                    >
                        Update password
                    </PendingButton>
                    {state.status != 0 && <p className="px-6">{state.body}</p>}
                </div>
            </form>

        </TabPanel>
    )
}