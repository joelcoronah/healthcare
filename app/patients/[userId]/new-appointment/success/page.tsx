import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getAppointment } from "../../../../../lib/actions/appointment.actions";
import { Doctors } from "../../../../../constants";
import { formatDateTime } from "../../../../../lib/utils";
import { Button } from "../../../../../components/ui/button";
const SucccessPage = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) ?? "";

  const appointment = await getAppointment(appointmentId);

  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          ></Image>
        </Link>

        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={300}
            width={280}
            alt="success"
          ></Image>

          <p className="text-center">Your appointment has been created</p>
        </section>

        <section className="header mb-6 max-w-[600px] text-center">
          Your <span className="text-green-500">appointment</span> has been{" "}
          <span>created</span>
        </section>
        <p>We will be in touch shortly to confirm.</p>

        <section className="request-details">
          <p>Requested appointment details:</p>
          <div className="flex items-center gap-3 ">
            <Image
              src={doctor?.image || "/assets/images/default-doctor.png"}
              height={100}
              width={100}
              alt="success"
              className="size-6"
            ></Image>
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
            <div className="flex gap-2">
              <Image
                src="/assets/icons/calendar.svg"
                height={24}
                width={24}
                alt={"calendar"}
              />
              <p>{formatDateTime(appointment.schedule).dateTime}</p>
            </div>
          </div>
        </section>
        <Button variant="outline" className="shad-primary-btn">
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
        <p className="copyright"> © 2024 Healthcare</p>
      </div>
    </div>
  );
};

export default SucccessPage;
