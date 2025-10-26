<script lang="ts" setup>
import { requestPasswordReset } from "~/plugins/auth.client";

const email = ref("");

const handleRequestPasswordReset = async () => {
  if (!email.value) {
    alert("Please enter your email address");
    return;
  }

  await requestPasswordReset(
    {
      email: email.value,
      redirectTo: "/reset-password",
    },
    {
      onSuccess() {
        alert("Password reset link sent to your email");
        window.location.href = "/sign-in";
      },
      onError(context) {
        alert(context.error.message);
      },
    },
  );
};
</script>

<template>
	<div class="h-screen flex justify-center items-center">
		<CardRoot class="mx-auto max-w-sm">
			<CardHeader>
				<CardTitle class="text-2xl">Reset Password</CardTitle>
				<CardDescription>
					Enter your email below to reset your password
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input id="email" v-model="email" type="email" placeholder="you@example.com" required />
					</div>
					<Button type="button" class="w-full" @click="handleRequestPasswordReset">
						Reset Password
					</Button>
				</div>
				<div class="mt-4 text-center text-sm">
					<a href="/sign-in" class="underline">Back to Sign In </a>
				</div>
			</CardContent>
		</CardRoot>
	</div>
</template>