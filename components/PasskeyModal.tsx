"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "../lib/utils";
const PasskeyModal = () => {
  const [open, setOpen] = useState(true);
  const [passkey, setPasskey] = useState("");

  const [error, setError] = useState("");
  const path = usePathname();

  const router = useRouter();
  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const encryptedKey =
    typeof window !== "undefined" ? localStorage.getItem("accessKey") : "";

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        debugger;
        setOpen(false);
        router.push("/admin");
      } else {
        setOpen(true);
      }
    }
  }, [encryptedKey]);

  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);

      localStorage.setItem("accessKey", encryptedKey);

      setOpen(false);
    } else {
      setError("Invalid passkey, Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin access verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              className="cursor-pointer"
              height={20}
              width={20}
              onClick={() => closeModal()}
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        {error && (
          <p className="shad-error text-14-regular mt-4 flex justify-center">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={(e) => {
              validatePasskey(e);
            }}
            className="shad-primary-btn w-full"
          >
            Enter Admin passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModal;
