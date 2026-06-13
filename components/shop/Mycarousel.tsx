"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 1800, stopOnInteraction: true })
  );
  const images = ["/carousel1.jpg", "/carousel2.jpg"];
  return (
    <div dir="ltr">
      <Carousel
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {images.map((src, index) => (
            <CarouselItem key={index}>
              <div className="h-full">
                <Card className="h-full">
                  <CardContent className="flex h-full">
                    <Image
                      className="object-fill"
                      src={src}
                      width={1400}
                      height={1200}
                      alt={`carousel Image ${index + 1}`}
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
