"use client"

import { useSearchParams } from "next/navigation"

export default function ActivateAccountPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded bg-white p-8 text-center shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Activate Your Account</h1>
        <p className="mb-4 text-gray-700">
          {email
            ? `Activation request for ${email}.`
            : "Please use the activation link from your email."}
        </p>
        <p className="mb-6 rounded bg-gray-50 p-3 text-left text-sm break-all text-gray-700">
          <strong>Token:</strong> {token ?? "Token not found"}
        </p>
        <p className="text-sm text-gray-600">
          If you did not receive the email, please check your spam folder or
          contact support.
        </p>
      </div>
    </div>
  )
}
