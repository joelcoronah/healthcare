"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import { CustomFormField } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "../../lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient } from "../../lib/actions/patient.actions";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "../../constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { FileUploader } from "../FileUploader";

export enum FieldTypes {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    let formData;
    console.log({ values });

    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      formData = new FormData();
      formData.append("file", values.identificationDocument[0]);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };

      // @ts-ignore
      const patient = await registerPatient(patientData);

      console.log({ patient });
      setIsLoading(false);

      if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error) {
      setIsLoading(false);

      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1"></div>
          <h2 className="sub-header">Personal Information</h2>
        </section>

        <CustomFormField
          fieldType={FieldTypes.INPUT}
          name="name"
          label="Full name"
          placeHolder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
          control={form.control}
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldTypes.INPUT}
            name="email"
            label="Email"
            placeHolder="Johndoe@test.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
            control={form.control}
          />
          <CustomFormField
            fieldType={FieldTypes.PHONE_INPUT}
            name="phone"
            label="Phone Number"
            placeHolder="(555) 555-5555"
            control={form.control}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldTypes.DATE_PICKER}
            name="birthDate"
            label="Date of Birth"
            control={form.control}
          />
          <CustomFormField
            fieldType={FieldTypes.SKELETON}
            name="gender"
            label="Gender"
            control={form.control}
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between select-none"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label className="cursor-pointer" htmlFor={option}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldTypes.INPUT}
            name="address"
            label="Address"
            placeHolder="14th Street, New york"
            control={form.control}
          />

          <CustomFormField
            fieldType={FieldTypes.INPUT}
            name="occupation"
            label="Occupation"
            placeHolder="Software Engineer"
            control={form.control}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldTypes.INPUT}
            name="emergencyContactName"
            label="Emergency contact name"
            placeHolder="Guardian's name"
            control={form.control}
          />
          <CustomFormField
            fieldType={FieldTypes.PHONE_INPUT}
            name="emergencyContactNumber"
            label="Emergency contact number"
            placeHolder="(555) 555-5555"
            control={form.control}
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1"></div>
          <h2 className="sub-header">Medical Information</h2>
        </section>

        <CustomFormField
          fieldType={FieldTypes.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeHolder="Select a physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer gap-2 items-center">
                <Image
                  src={doctor.image}
                  alt={doctor.name}
                  width={32}
                  height={32}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldTypes.INPUT}
            name="insuranceProvider"
            label="Insurance Provider"
            placeHolder="Blue Cross Blue Shield"
            control={form.control}
          />

          <CustomFormField
            fieldType={FieldTypes.INPUT}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            placeHolder="ABC123456789"
            control={form.control}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldTypes.TEXTAREA}
            name="allergies"
            label="Allergies (if any)"
            placeHolder="Peanuts, Penicillin, Pollen"
            control={form.control}
          />

          <CustomFormField
            fieldType={FieldTypes.TEXTAREA}
            name="currentMedication"
            label="Current medication (if any)"
            placeHolder="Ibuprofen 200mg"
            control={form.control}
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FieldTypes.TEXTAREA}
            name="familyMedicalHistory"
            label="Famly medical history"
            placeHolder="Mother had brain cancer, father had high blood pressure"
            control={form.control}
          />

          <CustomFormField
            fieldType={FieldTypes.TEXTAREA}
            name="pastMedicalHistory"
            label="Past medical history"
            placeHolder="Hypertension, Diabetes"
            control={form.control}
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1"></div>
          <h2 className="sub-header">Identification and Verification</h2>
        </section>

        <CustomFormField
          fieldType={FieldTypes.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeHolder="Select an identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FieldTypes.INPUT}
          name="identificationNumber"
          label="Identification Number"
          placeHolder="123456789"
          control={form.control}
        />

        <CustomFormField
          fieldType={FieldTypes.SKELETON}
          name="identificationDocument"
          label="Scanned copy of identification document"
          control={form.control}
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1"></div>
          <h2 className="sub-header">Consent and Privacy</h2>
        </section>

        <CustomFormField
          fieldType={FieldTypes.CHECKBOX}
          name="treatmentConsent"
          label="I consent to receive treatment"
          control={form.control}
        />
        <CustomFormField
          fieldType={FieldTypes.CHECKBOX}
          name="disclosureConsent"
          label="I consent to disclosure of information"
          control={form.control}
        />
        <CustomFormField
          fieldType={FieldTypes.CHECKBOX}
          name="privacyConsent"
          label="I consent to the processing of my personal information"
          control={form.control}
        />

        <SubmitButton isLoading={isLoading}>Get Startedxxxxxx</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
