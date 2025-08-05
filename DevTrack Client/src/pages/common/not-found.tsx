import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PAGE_TEXTS } from "@/constants";
import { useNotFoundController } from "./not-found.controller";

const NotFound = () => {
  const { handlers } = useNotFoundController();
  const { handleGoHome, handleGoBack } = handlers;

  return (
    <div className="flex items-center justify-center bg-background h-full">
      <Card className="w-full max-w-sm sm:max-w-md lg:max-w-xl">
        <CardContent className="flex flex-col items-center justify-center p-4 text-center">
          {/* 404 SVG Illustration */}
          <div className="">
            <svg
              width="300"
              height="200"
              viewBox="0 0 300 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto max-w-sm"
            >
              {/* Background circles */}
              <circle cx="80" cy="60" r="40" fill="var(--muted)" opacity="0.3" />
              <circle cx="220" cy="140" r="30" fill="var(--muted)" opacity="0.2" />

              {/* 404 Text */}
              <text
                x="150"
                y="80"
                textAnchor="middle"
                className="fill-primary font-bold"
                style={{ fontSize: "clamp(32px, 8vw, 48px)", fontFamily: "system-ui" }}
              >
                404
              </text>

              {/* Sad face */}
              <circle cx="150" cy="130" r="25" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" />
              <circle cx="142" cy="125" r="2" fill="var(--muted-foreground)" />
              <circle cx="158" cy="125" r="2" fill="var(--muted-foreground)" />
              <path
                d="M 140 140 Q 150 135 160 140"
                stroke="var(--muted-foreground)"
                strokeWidth="2"
                fill="none"
              />

              {/* Floating elements */}
              <rect x="50" y="30" width="8" height="8" fill="var(--primary)" opacity="0.6" transform="rotate(45 54 34)" />
              <rect x="240" y="50" width="6" height="6" fill="var(--primary)" opacity="0.4" transform="rotate(45 243 53)" />
              <circle cx="70" cy="160" r="3" fill="var(--primary)" opacity="0.5" />
              <circle cx="230" cy="80" r="4" fill="var(--primary)" opacity="0.3" />
            </svg>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              {PAGE_TEXTS.NOT_FOUND.TITLE}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-md">
              {PAGE_TEXTS.NOT_FOUND.DESCRIPTION}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleGoHome} size="lg" className="min-w-24 sm:min-w-32 text-white text-sm sm:text-base">
              {PAGE_TEXTS.NOT_FOUND.GO_TO_DASHBOARD}
            </Button>
            <Button onClick={handleGoBack} variant="outline" size="lg" className="min-w-24 sm:min-w-32 text-sm sm:text-base">
              {PAGE_TEXTS.NOT_FOUND.GO_BACK}
            </Button>
          </div>

          {/* Additional help text */}
          <p className="text-xs sm:text-sm text-muted-foreground mt-6">
            {PAGE_TEXTS.NOT_FOUND.SUPPORT_TEXT}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotFound;
