
export class SquadAddon {

    public static selectedSquadName: string | null = null;
    public static selectedMemberID: string | null = null;

    public static getHovered(): "squad" | "member" | null {
        if (SquadAddon.selectedSquadName != null) {
            return "squad";
        }
        if (SquadAddon.selectedMemberID != null) {
            return "member";
        }
        return null;
    }

}
(Window as any).SquadAddon = SquadAddon;