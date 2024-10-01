import Image from "next/image";
import Link from "next/link";
import React from "react";
import RegisterForm from "../../../../components/forms/RegisterFrom";
import { getUser } from "../../../../lib/actions/patient.actions";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-10 w-fit"
          ></Image>
          <RegisterForm user={user} />
          <div className="text-14-regular mt-20 flex justify-between ">
            <p className="justify-items text-dark-600 xl:text-left">
              © 2024 Healthcare
            </p>
            <Link href="/?admin=true" className="text-green-500 cursor-pointer">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="logo"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default Register;
