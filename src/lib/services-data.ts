import { Plane, Clock, Shield, Star, MapPin, Users, LucideIcon } from "lucide-react";

export interface Service {
    icon: LucideIcon;
    titleKey: string;
    descriptionKey: string;
    featuresKeys: string[];
    slug: string;
}

export const services: Service[] = [
    {
        icon: Plane,
        titleKey: "services.bespokeCharter.title",
        descriptionKey: "services.bespokeCharter.description",
        featuresKeys: [
            "services.bespokeCharter.features.itineraries",
            "services.bespokeCharter.features.amenities",
            "services.bespokeCharter.features.concierge"
        ],
        slug: "bespoke-charter"
    },
    {
        icon: Clock,
        titleKey: "services.onDemand.title",
        descriptionKey: "services.onDemand.description",
        featuresKeys: [
            "services.onDemand.features.response",
            "services.onDemand.features.network",
            "services.onDemand.features.availability"
        ],
        slug: "on-demand"
    },
    {
        icon: Shield,
        titleKey: "services.protection.title",
        descriptionKey: "services.protection.description",
        featuresKeys: [
            "services.protection.features.personnel",
            "services.protection.features.assessment",
            "services.protection.features.transport"
        ],
        slug: "executive-protection"
    },
    {
        icon: Star,
        titleKey: "services.membership.title",
        descriptionKey: "services.membership.description",
        featuresKeys: [
            "services.membership.features.booking",
            "services.membership.features.guaranteed",
            "services.membership.features.rates"
        ],
        slug: "membership"
    },
    {
        icon: MapPin,
        titleKey: "services.destination.title",
        descriptionKey: "services.destination.description",
        featuresKeys: [
            "services.destination.features.ground",
            "services.destination.features.accommodation",
            "services.destination.features.experiences"
        ],
        slug: "destination-management"
    },
    {
        icon: Users,
        titleKey: "services.group.title",
        descriptionKey: "services.group.description",
        featuresKeys: [
            "services.group.features.coordination",
            "services.group.features.logistics",
            "services.group.features.discounts"
        ],
        slug: "group-charter"
    }
];
