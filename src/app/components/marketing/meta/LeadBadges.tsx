"use client";

import { Badge } from "@mantine/core";
// import { LeadScore, LeadStatus, LeadSource } from "..";
import {
  scoreColor,
  scoreLabel,
  statusColor,
  statusLabel,
  sourceColor,
  sourceLabel,
} from "../utility/utils";
import { LeadScore, LeadSource, LeadStatus } from "@/types";

export function ScoreBadge({ score }: { score: LeadScore }) {
  return (
    <Badge color={scoreColor[score]} variant="light" size="sm" radius="sm">
      {scoreLabel[score]}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge color={statusColor[status]} variant="filled" size="sm" radius="sm">
      {statusLabel[status]}
    </Badge>
  );
}

export function SourceBadge({ source }: { source?: LeadSource }) {
  if (!source) return <Badge color="gray" variant="outline" size="sm" radius="sm">Unknown</Badge>;
  return (
    <Badge color={sourceColor[source]} variant="dot" size="sm" radius="sm">
      {sourceLabel[source]}
    </Badge>
  );
}