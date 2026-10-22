import { notFound } from "next/navigation";
import { Button, ButtonLink, IconButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardLink } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/layout/Container";
import DialogPreview from "@/components/ui/DialogPreview";
export const metadata = {
  title: "UI preview",
  robots: { index: false, follow: false },
};
export default function Preview() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main id="main" className="py-16">
      <Container>
        <h1 className="mb-10 text-h1 font-bold">UI</h1>
        <SectionHeading title="Button" />
        <div className="mb-10 flex flex-wrap gap-3">
          {(["primary", "secondary", "ghost", "accent"] as const).map(
            (variant) => (
              <Button key={variant} variant={variant}>
                {variant}
              </Button>
            ),
          )}
          <ButtonLink href="#badge">ButtonLink</ButtonLink>
          <IconButton aria-label="IconButton">+</IconButton>
        </div>
        <SectionHeading id="badge" title="Badge" />
        <div className="mb-10 flex gap-3">
          <Badge>Neutral</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="accent">Accent</Badge>
        </div>
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          <Card>Card</Card>
          <CardLink href="#badge">CardLink</CardLink>
        </div>
        <Avatar />
        <DialogPreview />
      </Container>
    </main>
  );
}
