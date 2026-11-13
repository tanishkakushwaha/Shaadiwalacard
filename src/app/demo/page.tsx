import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";
import { demoWedding } from "@/lib/demo";
export const metadata: Metadata = { title: "Explore your wedding dashboard" };
export default function DemoPage() { return <Dashboard user={{ name: "Ananya Sharma" }} weddings={[demoWedding]} demo/>; }
