import * as React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<View, { style?: ViewStyle; children: React.ReactNode }>(
  ({ style, children }, ref) => {
    const id = React.useId();

    return (
      <FormItemContext.Provider value={{ id }}>
        <View ref={ref} style={[styles.formItem, style]}>
          {children}
        </View>
      </FormItemContext.Provider>
    );
  }
);

FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<Text, { style?: TextStyle; children: React.ReactNode }>(
  ({ style, children }, ref) => {
    const { error, formItemId } = useFormField();

    return (
      <Text
        ref={ref}
        style={[styles.formLabel, error && styles.formLabelError, style]}
        accessibilityLabel={formItemId}
      >
        {children}
      </Text>
    );
  }
);

FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<View, { children: React.ReactNode; style?: ViewStyle }>(
  ({ children, style }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <View
        ref={ref}
        style={[styles.formControl, style]}
        accessibilityLabel={formItemId}
        accessibilityHint={error ? `Error: ${error.message}` : undefined}
      >
        {children}
      </View>
    );
  }
);

FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<Text, { style?: TextStyle; children: React.ReactNode }>(
  ({ style, children }, ref) => {
    const { formDescriptionId } = useFormField();

    return (
      <Text
        ref={ref}
        style={[styles.formDescription, style]}
        accessibilityLabel={formDescriptionId}
      >
        {children}
      </Text>
    );
  }
);

FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<Text, { style?: TextStyle; children?: React.ReactNode }>(
  ({ style, children }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <Text
        ref={ref}
        style={[styles.formMessage, style]}
        accessibilityLabel={formMessageId}
      >
        {body}
      </Text>
    );
  }
);

FormMessage.displayName = "FormMessage";

const styles = StyleSheet.create({
  formItem: {
    marginBottom: 8,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  formLabelError: {
    color: "#ef4444",
  },
  formControl: {
    width: "100%",
  },
  formDescription: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  formMessage: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ef4444",
    marginTop: 4,
  },
});

export {
  Form, FormControl,
  FormDescription, FormField, FormItem,
  FormLabel, FormMessage, useFormField
};

