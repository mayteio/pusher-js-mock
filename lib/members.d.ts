/** COPIED DIRECTLY FROM pusher-js PACKAGE */
export declare function objectApply(object: any, f: Function): void;
/** COPIED DIRECTLY FROM pusher-js PACKAGE */
/** Represents a collection of members of a presence channel. */
export default class Members {
    members: any;
    count: number;
    myID: any;
    me: any;
    constructor(members?: any);
    /** Returns member's info for given id.
     *
     * Resulting object containts two fields - id and info.
     *
     * @param {Number} id
     * @return {Object} member's info or null
     */
    get(id: string): any;
    /** Calls back for each member in unspecified order.
     *
     * @param  {Function} callback
     */
    each(callback: Function): void;
    /** Adds a new member to the collection. For internal use only. */
    addMember(memberData: any): any;
    /** Adds a member from the collection. For internal use only. */
    removeMember(memberData: any): any;
    /** Resets the collection to the initial state. For internal use only. */
    reset(members?: any): void;
}
