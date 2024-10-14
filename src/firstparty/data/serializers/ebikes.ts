import {ISerializer} from "./strings.js";

enum DockingStatus {
    DOCKABLE,
    NOT_DOCKABLE,
};

type EbikeData = {
    readonly range: number,
    readonly dockingStatus: DockingStatus;
}

class EbikeAvailabilitySerializer implements ISerializer<EbikeData[]> {
    serialize(value: EbikeData[]): string {
        const ebikesByDockingStatus = value.reduce<Record<DockingStatus, number>>((ebikesByDockingStatus, ebike) => {
                ebikesByDockingStatus[ebike.dockingStatus] += 1;
                return ebikesByDockingStatus;
            },
            {
                [DockingStatus.DOCKABLE]: 0,
                [DockingStatus.NOT_DOCKABLE]: 0
            });
        let information = "";
        if (ebikesByDockingStatus[DockingStatus.DOCKABLE]) {
            information += `${ebikesByDockingStatus[DockingStatus.DOCKABLE]} ⚡`;
        }

        if (ebikesByDockingStatus[DockingStatus.NOT_DOCKABLE]) {
            information += `${ebikesByDockingStatus[DockingStatus.NOT_DOCKABLE]} 🚧`;
        }
        return information;
    }
}

class EbikeRangeSerializer implements ISerializer<number[]> {
    serialize(ranges: number[]): string {
        const minRange = Math.min(...ranges);
        const maxRange = Math.max(...ranges);
        if (minRange === maxRange) {
            return`🔋 ${maxRange}`;
        }
        return `🪫 ${minRange} - 🔋${maxRange}`;
    }

}

export {
    EbikeAvailabilitySerializer,
    EbikeRangeSerializer,
    EbikeData,
    DockingStatus
}