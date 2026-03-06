import { Metadata } from "next";
import SocialsClient from "./page-client";

export const metadata: Metadata = {
    title: "Socials",
    description: "Connect with Arjun Rao across social platforms or send a direct message.",
};

export default function Socials() {
    return <SocialsClient />;
}
