interface entry {
    ent_seq: [number];
    k_ele?: k_ele[];
    r_ele: r_ele[];
    sense: sense[];
}

interface k_ele {
    keb: [string],
    ke_inf?: string[],
    ke_pri?: string[]
}

interface r_ele {
    reb: [string],
    re_nokanji?: [{}],
    re_restr?: string[],
    re_inf?: string[],
    re_pri: string[]
}

interface sense {
    stagk?: string[],
    stagr?: string[],
    pos?: string[],
    xref?: string[],
    ant?: string[],
    field?: string[],
    misc?: string[],
    s_inf?: string[],
    lsource?: lsource[],
    dial?: string[],
    gloss?: gloss[],
}

interface lsource {
    "xml:lang"?: string,
    ls_type?: string,
    ls_wasei?: "y",
    $t?: string
}

interface gloss {
    "xml:lang"?: string,
    g_gend?: string,
    $t?: string
}