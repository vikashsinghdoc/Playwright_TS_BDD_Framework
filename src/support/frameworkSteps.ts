import {
  Given as CucumberGiven,
  When as CucumberWhen,
  Then as CucumberThen,
} from "@cucumber/cucumber";

import { CustomWorld } from "../world/world";

type StepFunction = (this: CustomWorld, ...args: any[]) => any;

export const Given = (pattern: string, fn: StepFunction) =>
  CucumberGiven(pattern, fn);

export const When = (pattern: string, fn: StepFunction) =>
  CucumberWhen(pattern, fn);

export const Then = (pattern: string, fn: StepFunction) =>
  CucumberThen(pattern, fn);

export const And = Given;
export const But = Given;
