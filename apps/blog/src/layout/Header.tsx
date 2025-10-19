import { IconBell } from "@repo/shared-ui/icons/IconBell";
import { Account } from "./Account";
import { ButtonRound } from "@repo/shared-ui/buttons/ButtonRound";
import ButtonBack from "@repo/shared-ui/buttons/ButtonBack";
import { Button } from "@repo/shared-ui/buttons/button";

export function Header() {
	return (
		<header class="sticky top-0 w-full flex items-center justify-center z-50 text-text fill-white bg-background bg-tile shadow px-4 py-2">
			<div class="w-full flex items-center justify-between flex-1 max-w-5xl gap-4">
				<Account />
				<div class="flex items-center justify-center gap-4">
					<Button />
					<ButtonRound class="relative">
						<div class="bg-badge rounded-full absolute top-0 right-0 z-10 p-1" />
						<IconBell />
					</ButtonRound>
					<ButtonBack />
				</div>
			</div>
		</header>
	);
}
