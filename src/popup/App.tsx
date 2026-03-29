import {
  type ConfigState,
  useConfig,
  withAsyncStorageProvider,
  withConfigProvider,
} from "@/components/repository";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "@/index.css";
import { cn } from "@/lib";
import { ThemeType } from "@/types";
import { useForm } from "@tanstack/react-form";
import { DatasetType, LanguageType } from "cambridge-crawler";
import type { SubmitEvent } from "react";
import { validate } from "typia";

const ThemeTypeOptions = [
  { label: "系統", value: ThemeType.System },
  { label: "日間", value: ThemeType.Light },
  { label: "夜間", value: ThemeType.Dark },
];
const LanguageTypeOptions = [{ label: "繁體中文", value: LanguageType.ZhTw }];
const DatasetTypeOptions = [
  { label: "英英", value: DatasetType.En },
  { label: "英繁中", value: DatasetType.EnZhTw },
  { label: "英簡中", value: DatasetType.EnZhCh },
];

function App() {
  const { config, setConfig } = useConfig();

  const form = useForm({
    defaultValues: config,
    validators: {
      onSubmit: ({ value }) => {
        const result = validate<ConfigState>(value);
        if (result.success) return undefined;
        const fields = Object.fromEntries(
          result.errors.map((e) => [e.path, e.description]),
        );
        return fields;
      },
    },
    onSubmit: async ({ value }) => {
      chrome.runtime.sendMessage({ type: "CLOSE_SIDE_PANEL" });
      setConfig(value);
      window.close();
    },
  });

  const handleCancel = () => {
    form.reset();
    window.close();
  };

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    form.handleSubmit();
  };

  return (
    <Card className="min-w-60 min-h-full">
      <CardHeader>
        <CardTitle>設定</CardTitle>
        <CardDescription>變更設定後會自動關閉頁面</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="config" onSubmit={handleSubmit}>
          <FieldGroup>
            <form.Field name="theme">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>主題色</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={
                        field.handleChange as (value: string) => void
                      }
                    >
                      <SelectTrigger aria-invalid={isInvalid}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {ThemeTypeOptions.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="lang">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>語系</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={
                        field.handleChange as (value: string) => void
                      }
                    >
                      <SelectTrigger aria-invalid={isInvalid}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {LanguageTypeOptions.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="dataset">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field orientation="horizontal" data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>字典</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={
                        field.handleChange as (value: string) => void
                      }
                    >
                      <SelectTrigger aria-invalid={isInvalid}>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {DatasetTypeOptions.map(({ label, value }) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal" className={cn("flex", "justify-end")}>
          <Button type="button" variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button type="submit" form="config">
            變更
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

export default withAsyncStorageProvider(withConfigProvider(App));
