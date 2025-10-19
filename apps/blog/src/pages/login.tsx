import { Input } from "@repo/shared-ui/forms/Input";
import { Form } from "@repo/shared-ui/forms/Form";
import { IconPhone } from "@repo/shared-ui/icons/IconPhone";
import { IconLock } from "@repo/shared-ui/icons/IconLock";
import { IconRefresh } from "@repo/shared-ui/icons/IconRefresh";
import { Button } from "@repo/shared-ui/buttons/button";
import { storageUrl } from "../statics";
import { useAccount } from "../hooks/useAccount";

export function LoginPage() {
	const { onLogin, onChange, data, onForget } = useAccount();

	async function onSubmit(event: Event) {
		event.preventDefault();

		const res = data().data;
		if (res) await onLogin(res);
	}

	return (
		<Form onSubmit={onSubmit} class="items-center justify-center">
			<div class="flex flex-col items-center w-full max-w-md h-max">
				<img src={storageUrl + "/public/logo.webp"} class="w-full h-full" alt="Login illustration" />
			</div>
			<div class="w-full flex flex-col items-center text-center py-4 gap-1">
				<p class="font-peyda-bold text-lg">ورود</p>
			</div>

			<Input
				id="mail"
				icon={<IconPhone class="w-5 h-5" />}
				name="mail"
				placeholder="ایمیل"
				value={data()?.data?.email || ""}
				oninput={(e) => onChange({ email: e.target.value })}
				errors={data()?.validations?.email}
			/>
			<Input
				id="password"
				icon={<IconLock class="w-5 h-5" />}
				name="password"
				type="password"
				placeholder="رمز ورود"
				value={data()?.data?.password || ""}
				oninput={(e) => onChange({ password: e.target.value })}
				errors={data()?.validations?.password}
			/>

			<div class="flex pb-4 w-full justify-end text-action fill-action">
				<button
					type="button"
					onClick={(e) => {
						e.preventDefault();
						onForget(data()?.data?.email);
					}}
					class="flex items-center gap-2 text-xs px-4 clicker"
				>
					<IconRefresh class="w-3 h-3" />
					<p>فراموشی رمز عبور</p>
				</button>
			</div>
			<Button class="w-full" type="submit">
				شروع کنید
			</Button>
		</Form>
	);
}
