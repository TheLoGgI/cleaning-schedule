"use client"
import { TabPanel } from "@/app/components/Tab";
import { PendingButton } from "@/app/components/signInOut/pendingButton";
import { updateUserProfile } from "@/app/server/actions/profile/updateUserProfile";
import { AccountUserData } from "../page";
import { useFormState } from "react-dom";

const initialState = {
    status: 0,
    body: 'Profile Updated',
}

export function UpdateProfileTab({ user }: { user: AccountUserData }) {
    const [state, formAction] = useFormState(updateUserProfile, initialState)
    console.log('user: ', user);

    return (
        <TabPanel >
            <form action={formAction} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Update profile settings</h3>
                    <p className="text-sm text-muted-foreground">Change your name and notification setting</p>
                </div>

                <div className="flex flex-col space-y-4 p-6">
                    <div className="flex flex-col space-y-1 max-w-md">
                        <label
                            className="form-control w-full max-w-xs"
                            htmlFor="createRoomFirstname"
                        >
                            Firstname
                        </label>
                        <input
                            type="text"
                            id="createRoomFirstname"
                            name="firstName"
                            defaultValue={user?.firstName}
                            required
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="flex flex-col space-y-1 max-w-md">
                        <label className="form-control w-full max-w-xs" htmlFor="createModalLastname">
                            Last Name
                        </label>
                        <input
                            className="input input-bordered w-full"
                            name="lastName"
                            defaultValue={user?.lastName}
                            id="createModalLastname"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" name="inCleaningSchedule" id="createModalInCleaningSchedule" defaultChecked={user.notification} className="checkbox checkbox-primary" />
                        <label className="label cursor-pointer" htmlFor="createModalInCleaningSchedule">
                            Get email notifications, when it&apos;s your turn to clean
                        </label>
                    </div>

                    <div className="flex justify-between mt-6">
                        <div className="flex items-center space-x-4">
                            <PendingButton
                                type="submit"
                                className="btn block text-white bg-blue-700 enabled:hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  disabled:bg-gray-400 disabled:cursor-not-allowed"
                                loading={<span className="text-black">Updating...</span>}
                            >
                                Update profile
                            </PendingButton>
                            {state.status != 0 && <p className="px-6">{state.body}</p>}
                        </div>

                    </div>
                </div>
            </form>
            <div className="flex justify-end py-6">
                <button className="btn bg-red-500">Delete Account</button>
            </div>
        </TabPanel>
    )
}