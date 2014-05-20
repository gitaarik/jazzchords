--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE auth_group (
    id integer NOT NULL,
    name character varying(80) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO "Rik";

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO "Rik";

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE auth_group_id_seq OWNED BY auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO "Rik";

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO "Rik";

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE auth_group_permissions_id_seq OWNED BY auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE auth_permission (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO "Rik";

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO "Rik";

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE auth_permission_id_seq OWNED BY auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone NOT NULL,
    is_superuser boolean NOT NULL,
    username character varying(30) NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(30) NOT NULL,
    email character varying(75) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO "Rik";

--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE auth_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO "Rik";

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_groups_id_seq OWNER TO "Rik";

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE auth_user_groups_id_seq OWNED BY auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_id_seq OWNER TO "Rik";

--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE auth_user_id_seq OWNED BY auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE auth_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO "Rik";

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_user_permissions_id_seq OWNER TO "Rik";

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE auth_user_user_permissions_id_seq OWNED BY auth_user_user_permissions.id;


--
-- Name: chordcharts_chart; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE chordcharts_chart (
    id integer NOT NULL,
    song_id integer NOT NULL,
    key_id integer NOT NULL
);


ALTER TABLE public.chordcharts_chart OWNER TO "Rik";

--
-- Name: chordcharts_chart_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE chordcharts_chart_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chordcharts_chart_id_seq OWNER TO "Rik";

--
-- Name: chordcharts_chart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE chordcharts_chart_id_seq OWNED BY chordcharts_chart.id;


--
-- Name: chordcharts_chord; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE chordcharts_chord (
    id integer NOT NULL,
    measure_id integer NOT NULL,
    beats smallint NOT NULL,
    chord_type_id integer NOT NULL,
    chord_pitch smallint NOT NULL,
    "order" smallint NOT NULL,
    alt_bass boolean NOT NULL,
    alt_bass_pitch smallint NOT NULL,
    CONSTRAINT chordcharts_chord_alt_bass_pitch_check CHECK ((alt_bass_pitch >= 0)),
    CONSTRAINT chordcharts_chord_beats_check CHECK ((beats >= 0)),
    CONSTRAINT chordcharts_chord_chord_pitch_check CHECK ((chord_pitch >= 0)),
    CONSTRAINT chordcharts_chord_order_check CHECK (("order" >= 0)),
    CONSTRAINT ck_alt_bass_pitch_pstv_28b7c53366a8752c CHECK ((alt_bass_pitch >= 0)),
    CONSTRAINT ck_order_pstv_5254d30f0fca23f9 CHECK (("order" >= 0))
);


ALTER TABLE public.chordcharts_chord OWNER TO "Rik";

--
-- Name: chordcharts_chord_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE chordcharts_chord_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chordcharts_chord_id_seq OWNER TO "Rik";

--
-- Name: chordcharts_chord_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE chordcharts_chord_id_seq OWNED BY chordcharts_chord.id;


--
-- Name: chordcharts_chordtype; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE chordcharts_chordtype (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    symbol character varying(10) NOT NULL,
    chord_output character varying(10) NOT NULL,
    "order" smallint NOT NULL,
    CONSTRAINT chordcharts_chordtype_order_check CHECK (("order" >= 0))
);


ALTER TABLE public.chordcharts_chordtype OWNER TO "Rik";

--
-- Name: chordcharts_chordtype_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE chordcharts_chordtype_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chordcharts_chordtype_id_seq OWNER TO "Rik";

--
-- Name: chordcharts_chordtype_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE chordcharts_chordtype_id_seq OWNED BY chordcharts_chordtype.id;


--
-- Name: chordcharts_key; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE chordcharts_key (
    id integer NOT NULL,
    name character varying(25) NOT NULL,
    slug character varying(25) NOT NULL,
    tone character varying(2) NOT NULL,
    tonality smallint NOT NULL,
    distance_from_c smallint NOT NULL,
    "order" smallint NOT NULL,
    CONSTRAINT chordcharts_key_distance_from_c_check CHECK ((distance_from_c >= 0)),
    CONSTRAINT chordcharts_key_order_check CHECK (("order" >= 0)),
    CONSTRAINT chordcharts_key_tonality_check CHECK ((tonality >= 0))
);


ALTER TABLE public.chordcharts_key OWNER TO "Rik";

--
-- Name: chordcharts_key_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE chordcharts_key_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chordcharts_key_id_seq OWNER TO "Rik";

--
-- Name: chordcharts_key_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE chordcharts_key_id_seq OWNED BY chordcharts_key.id;


--
-- Name: chordcharts_line; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE chordcharts_line (
    id integer NOT NULL,
    section_id integer,
    number smallint NOT NULL,
    subsection_id integer,
    CONSTRAINT chordcharts_line_number_check CHECK ((number >= 0)),
    CONSTRAINT ck_number_pstv_6b3db1325c423778 CHECK ((number >= 0))
);


ALTER TABLE public.chordcharts_line OWNER TO "Rik";

--
-- Name: chordcharts_line_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE chordcharts_line_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chordcharts_line_id_seq OWNER TO "Rik";

--
-- Name: chordcharts_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE chordcharts_line_id_seq OWNED BY chordcharts_line.id;


--
-- Name: chordcharts_measure; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE chordcharts_measure (
    id integer NOT NULL,
    line_id integer NOT NULL,
    beat_schema character varying(13) NOT NULL,
    number smallint NOT NULL,
    CONSTRAINT chordcharts_measure_number_check CHECK ((number >= 0)),
    CONSTRAINT ck_number_pstv_24d9db68d0486cc9 CHECK ((number >= 0))
);


ALTER TABLE public.chordcharts_measure OWNER TO "Rik";

--
-- Name: chordcharts_measure_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE chordcharts_measure_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chordcharts_measure_id_seq OWNER TO "Rik";

--
-- Name: chordcharts_measure_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE chordcharts_measure_id_seq OWNED BY chordcharts_measure.id;


--
-- Name: chordcharts_note; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE chordcharts_note (
    id integer NOT NULL,
    name character varying(2) NOT NULL,
    key_id integer NOT NULL,
    distance_from_root smallint NOT NULL,
    key_note boolean NOT NULL,
    CONSTRAINT chordcharts_note_distance_from_root_check CHECK ((distance_from_root >= 0))
);


ALTER TABLE public.chordcharts_note OWNER TO "Rik";

--
-- Name: chordcharts_note_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE chordcharts_note_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chordcharts_note_id_seq OWNER TO "Rik";

--
-- Name: chordcharts_note_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE chordcharts_note_id_seq OWNED BY chordcharts_note.id;


--
-- Name: chordcharts_section; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE chordcharts_section (
    id integer NOT NULL,
    chart_id integer NOT NULL,
    key_distance_from_chart smallint NOT NULL,
    alt_name character varying(25) NOT NULL,
    number smallint NOT NULL,
    time_signature_id integer NOT NULL,
    use_subsections boolean NOT NULL,
    CONSTRAINT chordcharts_section_key_distance_from_chart_check CHECK ((key_distance_from_chart >= 0)),
    CONSTRAINT chordcharts_section_number_check CHECK ((number >= 0)),
    CONSTRAINT ck_number_pstv_5b4f338699d97492 CHECK ((number >= 0))
);


ALTER TABLE public.chordcharts_section OWNER TO "Rik";

--
-- Name: chordcharts_section_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE chordcharts_section_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chordcharts_section_id_seq OWNER TO "Rik";

--
-- Name: chordcharts_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE chordcharts_section_id_seq OWNED BY chordcharts_section.id;


--
-- Name: chordcharts_subsection; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE chordcharts_subsection (
    id integer NOT NULL,
    number smallint NOT NULL,
    section_id integer NOT NULL,
    letter character varying(1) NOT NULL,
    CONSTRAINT chordcharts_subsection_number_check CHECK ((number >= 0))
);


ALTER TABLE public.chordcharts_subsection OWNER TO "Rik";

--
-- Name: chordcharts_subsection_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE chordcharts_subsection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chordcharts_subsection_id_seq OWNER TO "Rik";

--
-- Name: chordcharts_subsection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE chordcharts_subsection_id_seq OWNED BY chordcharts_subsection.id;


--
-- Name: chordcharts_timesignature; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE chordcharts_timesignature (
    id integer NOT NULL,
    beats smallint NOT NULL,
    beat_unit smallint NOT NULL,
    CONSTRAINT chordcharts_timesignature_beat_unit_check CHECK ((beat_unit >= 0)),
    CONSTRAINT chordcharts_timesignature_beats_check CHECK ((beats >= 0))
);


ALTER TABLE public.chordcharts_timesignature OWNER TO "Rik";

--
-- Name: chordcharts_timesignature_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE chordcharts_timesignature_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.chordcharts_timesignature_id_seq OWNER TO "Rik";

--
-- Name: chordcharts_timesignature_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE chordcharts_timesignature_id_seq OWNED BY chordcharts_timesignature.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    user_id integer NOT NULL,
    content_type_id integer,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO "Rik";

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO "Rik";

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE django_admin_log_id_seq OWNED BY django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE django_content_type (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO "Rik";

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO "Rik";

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE django_content_type_id_seq OWNED BY django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO "Rik";

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO "Rik";

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE django_migrations_id_seq OWNED BY django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO "Rik";

--
-- Name: django_site; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE django_site (
    id integer NOT NULL,
    domain character varying(100) NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.django_site OWNER TO "Rik";

--
-- Name: django_site_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE django_site_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_site_id_seq OWNER TO "Rik";

--
-- Name: django_site_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE django_site_id_seq OWNED BY django_site.id;


--
-- Name: songs_song; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE songs_song (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    slug character varying(50) NOT NULL
);


ALTER TABLE public.songs_song OWNER TO "Rik";

--
-- Name: songs_song_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE songs_song_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.songs_song_id_seq OWNER TO "Rik";

--
-- Name: songs_song_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE songs_song_id_seq OWNED BY songs_song.id;


--
-- Name: south_migrationhistory; Type: TABLE; Schema: public; Owner: Rik; Tablespace: 
--

CREATE TABLE south_migrationhistory (
    id integer NOT NULL,
    app_name character varying(255) NOT NULL,
    migration character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.south_migrationhistory OWNER TO "Rik";

--
-- Name: south_migrationhistory_id_seq; Type: SEQUENCE; Schema: public; Owner: Rik
--

CREATE SEQUENCE south_migrationhistory_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.south_migrationhistory_id_seq OWNER TO "Rik";

--
-- Name: south_migrationhistory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: Rik
--

ALTER SEQUENCE south_migrationhistory_id_seq OWNED BY south_migrationhistory.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_group ALTER COLUMN id SET DEFAULT nextval('auth_group_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('auth_group_permissions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_permission ALTER COLUMN id SET DEFAULT nextval('auth_permission_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_user ALTER COLUMN id SET DEFAULT nextval('auth_user_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_user_groups ALTER COLUMN id SET DEFAULT nextval('auth_user_groups_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('auth_user_user_permissions_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_chart ALTER COLUMN id SET DEFAULT nextval('chordcharts_chart_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_chord ALTER COLUMN id SET DEFAULT nextval('chordcharts_chord_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_chordtype ALTER COLUMN id SET DEFAULT nextval('chordcharts_chordtype_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_key ALTER COLUMN id SET DEFAULT nextval('chordcharts_key_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_line ALTER COLUMN id SET DEFAULT nextval('chordcharts_line_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_measure ALTER COLUMN id SET DEFAULT nextval('chordcharts_measure_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_note ALTER COLUMN id SET DEFAULT nextval('chordcharts_note_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_section ALTER COLUMN id SET DEFAULT nextval('chordcharts_section_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_subsection ALTER COLUMN id SET DEFAULT nextval('chordcharts_subsection_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_timesignature ALTER COLUMN id SET DEFAULT nextval('chordcharts_timesignature_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY django_admin_log ALTER COLUMN id SET DEFAULT nextval('django_admin_log_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY django_content_type ALTER COLUMN id SET DEFAULT nextval('django_content_type_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY django_migrations ALTER COLUMN id SET DEFAULT nextval('django_migrations_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY django_site ALTER COLUMN id SET DEFAULT nextval('django_site_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY songs_song ALTER COLUMN id SET DEFAULT nextval('songs_song_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY south_migrationhistory ALTER COLUMN id SET DEFAULT nextval('south_migrationhistory_id_seq'::regclass);


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY auth_group (id, name) FROM stdin;
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('auth_group_id_seq', 1, false);


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('auth_group_permissions_id_seq', 1, false);


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add permission	1	add_permission
2	Can change permission	1	change_permission
3	Can delete permission	1	delete_permission
4	Can add group	2	add_group
5	Can change group	2	change_group
6	Can delete group	2	delete_group
7	Can add user	3	add_user
8	Can change user	3	change_user
9	Can delete user	3	delete_user
10	Can add content type	4	add_contenttype
11	Can change content type	4	change_contenttype
12	Can delete content type	4	delete_contenttype
13	Can add session	5	add_session
14	Can change session	5	change_session
15	Can delete session	5	delete_session
16	Can add site	6	add_site
17	Can change site	6	change_site
18	Can delete site	6	delete_site
19	Can add log entry	7	add_logentry
20	Can change log entry	7	change_logentry
21	Can delete log entry	7	delete_logentry
22	Can add migration history	8	add_migrationhistory
23	Can change migration history	8	change_migrationhistory
24	Can delete migration history	8	delete_migrationhistory
25	Can add song	9	add_song
26	Can change song	9	change_song
27	Can delete song	9	delete_song
28	Can add key	10	add_key
29	Can change key	10	change_key
30	Can delete key	10	delete_key
31	Can add note	11	add_note
32	Can change note	11	change_note
33	Can delete note	11	delete_note
34	Can add chord type	12	add_chordtype
35	Can change chord type	12	change_chordtype
36	Can delete chord type	12	delete_chordtype
37	Can add chart	13	add_chart
38	Can change chart	13	change_chart
39	Can delete chart	13	delete_chart
40	Can add section	14	add_section
41	Can change section	14	change_section
42	Can delete section	14	delete_section
43	Can add line	15	add_line
44	Can change line	15	change_line
45	Can delete line	15	delete_line
46	Can add measure	16	add_measure
47	Can change measure	16	change_measure
48	Can delete measure	16	delete_measure
49	Can add chord	17	add_chord
50	Can change chord	17	change_chord
51	Can delete chord	17	delete_chord
52	Can add time signature	18	add_timesignature
53	Can change time signature	18	change_timesignature
54	Can delete time signature	18	delete_timesignature
55	Can add subsection	19	add_subsection
56	Can change subsection	19	change_subsection
57	Can delete subsection	19	delete_subsection
\.


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('auth_permission_id_seq', 57, true);


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
1	pbkdf2_sha256$12000$90NfHU98DniH$QJwXyC3objxwEXni1cecn5tyKlp2cj3Mu5/y+dQc8KQ=	2014-05-17 13:49:32.116179+02	t	rik			gitaarik@gmail.com	t	t	2013-08-09 08:49:37.567096+02
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('auth_user_id_seq', 1, true);


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('auth_user_user_permissions_id_seq', 1, false);


--
-- Data for Name: chordcharts_chart; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY chordcharts_chart (id, song_id, key_id) FROM stdin;
1	1	1
2	2	2
3	3	7
4	4	3
5	5	8
6	6	6
7	7	3
8	8	1
\.


--
-- Name: chordcharts_chart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('chordcharts_chart_id_seq', 8, true);


--
-- Data for Name: chordcharts_chord; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY chordcharts_chord (id, measure_id, beats, chord_type_id, chord_pitch, "order", alt_bass, alt_bass_pitch) FROM stdin;
496	191	4	2	0	1	f	0
3	2	2	1	5	1	f	0
4	2	2	1	7	2	f	0
1061	535	4	1	0	1	f	0
5	3	2	8	0	1	f	0
6	3	2	5	9	2	f	0
7	4	2	4	5	1	f	0
8	4	2	4	7	2	f	0
12	9	4	22	5	1	f	0
13	10	4	4	0	1	f	0
14	11	2	4	0	1	f	0
15	11	1	1	0	2	t	4
16	11	1	10	3	3	f	0
17	12	4	5	2	1	f	0
18	13	4	22	9	1	f	0
19	14	4	2	2	1	f	0
20	15	4	12	2	1	f	0
21	16	4	5	2	1	f	0
23	18	4	2	2	1	f	0
25	20	4	8	0	1	f	0
26	21	4	8	0	1	f	0
22	17	4	3	7	1	f	0
24	19	4	3	7	1	f	0
419	133	4	1	0	1	f	0
459	164	2	5	2	1	f	0
900	459	2	3	9	2	f	0
29	24	4	8	5	1	f	0
27	22	4	3	0	1	f	0
28	23	4	3	0	1	f	0
30	25	4	11	2	1	f	0
31	26	4	8	0	1	f	0
32	27	2	8	0	1	f	0
33	27	1	5	4	2	f	0
34	27	4	5	3	3	f	0
35	28	4	5	2	1	f	0
36	29	4	3	7	1	f	0
37	30	4	8	0	1	f	0
38	31	4	13	7	1	f	0
39	32	2	8	0	1	f	0
40	32	2	5	9	2	f	0
41	33	2	5	2	1	f	0
42	33	2	3	7	2	f	0
43	34	2	8	0	1	f	0
44	34	2	13	9	2	f	0
45	35	2	5	2	1	f	0
46	35	2	3	7	2	f	0
47	36	2	2	4	1	f	0
48	36	2	13	9	2	f	0
49	37	4	3	2	1	f	0
51	39	4	3	7	1	f	0
50	38	4	5	2	1	f	0
52	40	2	8	0	1	f	0
53	40	2	5	9	2	f	0
54	41	2	5	2	1	f	0
55	41	2	3	7	2	f	0
56	42	2	8	0	1	f	0
57	42	2	13	9	2	f	0
58	43	2	3	9	1	f	0
59	43	2	5	2	2	f	0
1	1	2	8	0	1	f	0
60	44	4	1	5	1	f	0
61	45	4	10	6	1	f	0
62	46	4	3	7	1	f	0
63	47	4	3	7	1	f	0
394	118	4	1	0	1	f	0
392	117	4	1	0	1	f	0
403	123	2	10	8	2	f	0
404	124	2	2	9	1	f	0
405	124	2	3	2	2	f	0
406	125	4	1	7	1	f	0
408	126	4	3	7	1	f	0
402	123	2	1	7	1	f	0
410	127	4	4	5	1	f	0
411	128	4	9	5	1	f	0
412	129	4	7	5	1	f	0
385	111	4	1	0	1	f	0
386	112	4	1	0	1	f	0
434	143	4	4	5	1	f	0
413	130	4	7	5	1	f	0
387	113	4	3	9	1	f	0
388	114	4	3	9	1	f	0
389	115	4	3	2	1	f	0
435	144	4	9	5	1	f	0
396	119	2	2	4	1	f	0
391	116	2	3	7	2	f	0
414	131	4	1	0	1	f	0
400	119	2	3	11	2	f	0
11	8	4	8	0	1	f	0
416	132	4	3	11	1	f	0
397	120	4	3	11	1	f	0
398	121	2	3	11	1	f	0
430	139	4	3	2	1	f	0
401	121	2	2	4	2	f	0
431	140	4	3	2	1	f	0
399	122	4	2	4	1	f	0
423	134	1	3	7	2	f	0
424	134	1	3	8	3	f	0
10	7	4	8	0	1	f	0
422	134	2	1	0	1	f	0
432	141	4	5	2	1	f	0
9	5	4	8	0	1	f	0
433	142	4	3	7	1	f	0
436	145	4	7	5	1	f	0
437	146	4	7	5	1	f	0
439	148	4	3	11	1	f	0
438	147	4	1	0	1	f	0
440	149	4	1	0	1	f	0
441	150	2	1	0	1	f	0
442	150	1	3	7	2	f	0
446	153	4	3	4	1	f	0
443	150	1	3	8	3	f	0
448	155	4	3	5	1	f	0
447	154	4	5	9	1	f	0
449	156	4	10	6	1	f	0
450	157	4	1	0	1	f	0
451	158	4	3	0	1	f	0
429	138	4	3	9	1	f	0
428	137	4	3	9	1	f	0
427	136	4	3	9	1	f	0
426	135	4	3	9	1	f	0
445	152	4	3	9	1	f	0
444	151	4	3	9	1	f	0
453	160	4	3	4	1	f	0
454	161	2	5	2	1	f	0
457	163	2	5	2	1	f	0
456	161	2	3	9	2	f	0
455	162	4	5	2	1	f	0
458	163	2	3	9	2	f	0
485	182	4	3	9	1	f	0
495	190	4	13	7	1	f	0
497	192	4	2	0	1	f	0
498	193	4	2	0	1	f	0
499	194	4	2	0	1	f	0
500	195	4	2	0	1	f	0
390	116	2	1	5	1	f	0
504	199	4	2	5	1	f	0
529	222	4	2	5	1	f	0
503	198	4	3	7	1	f	0
518	212	2	5	4	1	f	0
793	395	4	1	0	1	f	0
610	298	4	10	1	1	f	0
808	407	4	1	0	1	f	0
611	299	4	3	2	1	f	0
501	196	4	2	0	1	f	0
502	197	4	2	5	1	f	0
465	167	4	2	9	1	f	0
466	168	4	2	9	1	f	0
467	169	4	2	2	1	f	0
468	170	4	2	2	1	f	0
612	300	4	3	7	1	f	0
795	397	4	5	2	1	f	0
469	171	4	3	7	1	f	0
470	172	4	3	7	1	f	0
506	200	4	3	7	1	f	0
471	173	4	1	0	1	f	0
794	396	4	10	3	1	f	0
507	201	4	2	5	1	f	0
796	398	4	3	7	1	f	0
472	174	4	13	7	1	f	0
613	301	4	8	0	1	f	0
508	202	4	3	7	1	f	0
473	175	4	1	0	1	f	0
535	225	4	10	0	1	f	0
474	176	4	3	4	1	f	0
797	399	4	10	6	1	f	0
536	226	4	10	0	1	f	0
475	177	2	5	2	1	f	0
510	204	4	3	7	1	f	0
614	302	4	13	7	1	f	0
476	177	2	3	9	2	f	0
477	178	4	5	2	1	f	0
798	400	2	3	11	1	f	0
479	179	2	5	2	1	f	0
480	179	2	3	9	2	f	0
481	180	2	5	2	1	f	0
534	224	4	8	0	1	f	0
511	205	4	2	0	1	f	0
537	227	4	3	7	1	f	0
512	206	4	3	7	1	f	0
533	223	4	8	0	1	f	0
513	207	4	1	0	1	f	0
509	203	4	2	5	1	f	0
514	208	4	1	0	1	f	0
515	209	4	1	0	1	f	0
799	400	2	10	6	2	f	0
516	210	4	1	0	1	f	0
517	211	4	1	0	1	f	0
538	228	4	3	7	1	f	0
487	183	4	2	2	1	f	0
482	180	2	3	7	2	f	0
800	401	4	3	11	1	f	0
483	181	4	2	7	1	f	0
460	164	2	3	7	2	f	0
802	402	2	3	11	1	f	0
461	165	4	1	0	1	f	0
463	166	2	1	0	1	f	0
803	402	2	10	0	2	f	0
488	166	2	1	4	2	f	0
804	403	4	3	7	1	f	0
807	406	4	3	7	1	f	0
489	184	4	1	4	1	f	0
520	212	2	10	3	2	f	0
806	405	4	3	7	1	f	0
490	185	4	2	9	1	f	0
491	186	4	2	2	1	f	0
809	408	4	3	7	1	f	0
539	229	4	8	0	1	f	0
492	187	4	3	7	1	f	0
521	214	4	3	7	1	f	0
519	213	4	5	2	1	f	0
810	409	2	1	0	1	f	0
813	409	2	5	2	2	f	0
522	215	4	5	2	1	f	0
811	410	4	3	7	1	f	0
825	419	4	3	7	1	f	0
523	216	4	3	7	1	f	0
493	188	4	3	7	1	f	0
815	412	4	10	3	1	f	0
540	230	4	3	7	1	f	0
524	217	4	1	0	1	f	0
494	189	4	1	0	1	f	0
525	218	4	1	0	1	f	0
816	413	4	5	2	1	f	0
526	219	4	5	2	1	f	0
817	414	4	3	7	1	f	0
527	220	4	3	7	1	f	0
528	221	4	1	0	1	f	0
818	415	4	10	6	1	f	0
819	416	2	3	11	1	f	0
820	416	2	10	6	2	f	0
593	281	4	3	11	1	f	0
821	417	4	3	11	1	f	0
823	418	2	3	11	1	f	0
594	282	4	3	4	1	f	0
824	418	2	10	0	2	f	0
814	411	4	1	0	1	f	0
826	420	2	5	2	1	f	0
899	459	2	1	0	1	f	0
1069	542	2	3	7	2	f	0
595	283	4	3	9	1	f	0
2	1	2	5	9	2	f	0
605	293	4	3	4	1	f	0
606	294	4	3	4	1	f	0
607	295	4	1	5	1	f	0
596	284	4	3	2	1	f	0
591	279	4	8	0	1	f	0
592	280	4	8	0	1	f	0
597	285	4	3	7	1	f	0
598	286	4	3	7	1	f	0
599	287	4	8	0	1	f	0
600	288	4	8	0	1	f	0
601	289	4	10	0	1	f	0
602	290	4	10	0	1	f	0
603	291	4	3	7	1	f	0
604	292	4	3	7	1	f	0
608	296	4	10	6	1	f	0
609	297	4	8	0	1	f	0
805	404	2	5	2	1	f	0
851	404	2	3	7	2	f	0
852	420	2	3	7	2	f	0
828	422	4	3	7	1	f	0
827	421	4	3	7	1	f	0
829	423	4	1	0	1	f	0
830	424	2	5	2	1	f	0
831	424	2	3	7	2	f	0
833	425	2	5	2	2	f	0
832	425	2	1	0	1	f	0
835	426	2	3	11	2	f	0
834	426	2	1	0	1	f	0
853	435	4	5	4	1	f	0
915	467	4	2	2	1	f	0
855	436	2	3	11	2	f	0
854	436	2	5	4	1	f	0
856	437	4	5	4	1	f	0
859	438	2	13	9	2	f	0
858	438	2	3	9	1	f	0
860	439	4	5	2	1	f	0
862	440	4	3	9	1	f	0
864	441	4	5	2	1	f	0
866	442	4	3	7	1	f	0
868	443	4	1	0	1	f	0
869	444	4	10	3	1	f	0
871	445	4	5	2	1	f	0
873	446	4	3	7	1	f	0
875	447	4	10	6	1	f	0
877	448	2	3	11	1	f	0
878	448	2	10	6	2	f	0
879	449	4	3	11	1	f	0
881	450	2	3	11	1	f	0
882	450	2	10	0	2	f	0
883	451	4	3	7	1	f	0
885	452	2	3	7	2	f	0
884	452	2	5	2	1	f	0
888	454	4	3	7	1	f	0
886	453	4	3	7	1	f	0
890	455	4	1	0	1	f	0
892	456	2	5	2	1	f	0
893	456	2	3	7	2	f	0
894	457	4	1	0	1	f	0
896	458	2	5	2	1	f	0
897	458	2	3	7	2	f	0
931	475	4	2	2	1	f	0
901	460	2	3	2	1	f	0
902	460	2	3	7	2	f	0
968	491	4	2	2	1	f	0
905	462	2	3	2	1	f	0
984	499	4	2	7	1	f	0
906	462	2	3	7	2	f	0
903	461	2	1	0	1	f	0
904	461	2	3	9	2	f	0
1062	536	4	3	2	1	f	0
907	463	4	1	0	1	f	0
1107	573	2	1	0	1	f	0
918	468	2	3	9	2	f	0
909	464	4	3	4	1	f	0
1114	577	2	3	7	2	f	0
911	465	4	3	5	1	f	0
1105	571	4	3	2	1	f	0
913	466	2	1	0	1	f	0
914	466	2	3	9	2	f	0
917	468	2	1	0	1	f	0
948	483	4	3	2	1	f	0
934	476	2	3	9	2	f	0
919	469	2	3	2	1	f	0
920	469	2	3	7	2	f	0
951	484	4	3	2	1	f	0
933	476	2	1	0	1	f	0
921	470	4	1	0	1	f	0
923	471	4	1	0	1	f	0
1110	575	2	3	9	2	f	0
1112	576	2	3	7	2	f	0
935	477	2	3	2	1	f	0
936	477	2	3	7	2	f	0
937	478	4	1	0	1	f	0
925	472	4	3	4	1	f	0
927	473	4	3	5	1	f	0
930	474	2	3	9	2	f	0
964	489	4	3	5	1	f	0
939	479	4	3	0	1	f	0
958	486	4	3	7	1	f	0
954	485	4	3	7	1	f	0
941	480	4	3	0	1	f	0
943	481	4	3	5	1	f	0
945	482	2	3	5	1	f	0
929	474	2	1	0	1	f	0
946	482	1	3	4	2	f	0
947	482	1	3	3	3	f	0
960	487	4	1	0	1	f	0
962	488	4	3	4	1	f	0
973	493	2	3	7	2	f	0
967	490	2	3	9	2	f	0
966	490	2	1	0	1	f	0
971	492	2	3	9	2	f	0
972	493	2	3	2	1	f	0
970	492	2	1	0	1	f	0
974	494	4	1	0	1	f	0
976	495	4	1	5	1	f	0
980	497	4	3	10	1	f	0
978	496	4	3	9	1	f	0
983	498	2	3	2	2	f	0
982	498	2	1	5	1	f	0
1000	507	4	2	7	1	f	0
1037	523	4	2	7	1	f	0
1063	537	4	3	7	1	f	0
987	500	2	3	2	2	f	0
1055	532	4	3	0	1	f	0
986	500	2	1	5	1	f	0
1106	572	4	3	7	1	f	0
988	501	2	3	7	1	f	0
1064	538	4	1	0	1	f	0
989	501	2	3	0	2	f	0
1065	539	4	3	9	1	f	0
990	502	4	1	5	1	f	0
992	503	4	1	5	1	f	0
1066	540	4	3	2	1	f	0
1067	541	4	3	7	1	f	0
1068	542	2	1	0	1	f	0
1111	576	2	3	2	1	f	0
452	159	4	1	0	1	f	0
994	504	4	3	9	1	f	0
1031	520	4	3	9	1	f	0
1057	533	2	1	5	1	f	0
996	505	4	3	10	1	f	0
1033	521	4	3	10	1	f	0
998	506	2	1	5	1	f	0
999	506	2	3	2	2	f	0
1058	533	2	10	6	2	f	0
1035	522	2	1	5	1	f	0
1036	522	2	3	2	2	f	0
1002	508	2	1	5	1	f	0
1003	508	2	3	2	2	f	0
1059	534	4	3	7	1	f	0
1005	509	2	3	0	2	f	0
1115	573	2	10	1	2	f	0
1006	510	4	1	5	1	f	0
1113	577	2	1	0	1	f	0
1108	574	4	3	9	1	f	0
1008	511	4	3	5	1	f	0
1010	512	4	3	5	1	f	0
1012	513	4	3	10	1	f	0
1014	514	2	3	10	1	f	0
1015	514	1	3	9	2	f	0
1016	514	1	3	8	3	f	0
1017	515	4	3	7	1	f	0
1020	516	4	3	7	1	f	0
1023	517	4	3	0	1	f	0
1026	518	4	3	0	1	f	0
1104	570	4	1	0	1	f	0
1029	519	4	1	5	1	f	0
1109	575	2	1	0	1	f	0
1039	524	2	1	5	1	f	0
1040	524	2	3	2	2	f	0
1041	525	2	1	7	1	f	0
1042	525	2	3	0	2	f	0
1043	526	4	1	5	1	f	0
1004	509	2	3	7	1	f	0
1045	527	4	1	5	1	f	0
1047	528	4	3	2	1	f	0
1049	529	4	3	2	1	f	0
1051	530	4	3	7	1	f	0
1053	531	4	1	10	1	f	0
\.


--
-- Name: chordcharts_chord_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('chordcharts_chord_id_seq', 1143, true);


--
-- Data for Name: chordcharts_chordtype; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY chordcharts_chordtype (id, name, symbol, chord_output, "order") FROM stdin;
1	Major	M		0
2	Minor	m	m	1
3	Seventh	7	7	2
4	Major Seventh	△7	△7	3
5	Minor Seventh	-7	-7	4
6	Sixth	6	6	5
7	Minor Sixth	-6	-6	7
8	Six Ninth	6/9	6/9	8
9	Major Sixth	△6	△6	6
13	Augmented Seventh	7+5	7+5	12
19	Seventh with Flattened Ninth and Sharpened Fifth	7b9#5	7b9#5	21
22	Dominant Ninth	9	9	9
11	Half Diminished	0̸ 	0̸ 	13
16	Dominant Seventh with Sharpened Fifth	7#5	7#5	14
17	Dominant Seventh with Flattened Fifth	7b5	7b5	15
14	Seventh with Sharpened Ninth	7#9	7#9	16
15	Seventh with Flattened Ninth	7b9	7b9	17
21	Eleventh	11	11	18
20	Thirteenth	13	13	19
12	Minor Major	-△	-△	20
18	Seventh with Sharpened Ninth and Sharpened Fifth	7#9#5	7#9#5	22
10	Diminished	°	°	11
23	Minor Ninth	-9	-9	10
\.


--
-- Name: chordcharts_chordtype_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('chordcharts_chordtype_id_seq', 23, true);


--
-- Data for Name: chordcharts_key; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY chordcharts_key (id, name, slug, tone, tonality, distance_from_c, "order") FROM stdin;
1	C Major	c-major	C	1	0	1
2	F Major	f-major	F	1	5	4
3	G Major	g-major	G	1	7	5
4	A Major	a-major	A	1	10	6
5	C# Major	c-sharp-major	C#	1	1	8
6	Bb Major	b-flat-major	Bb	1	10	9
7	D Major	d-major	D	1	2	2
9	B Major	b-major	B	1	11	7
8	E Major	e-major	E	1	4	3
\.


--
-- Name: chordcharts_key_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('chordcharts_key_id_seq', 9, true);


--
-- Data for Name: chordcharts_line; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY chordcharts_line (id, section_id, number, subsection_id) FROM stdin;
240	\N	1	58
241	\N	2	58
242	\N	3	58
243	\N	4	58
245	\N	5	58
246	\N	6	58
247	\N	7	58
248	\N	1	60
249	\N	1	61
250	\N	2	61
251	\N	3	61
252	\N	4	61
253	\N	1	62
254	\N	2	62
255	\N	3	62
256	\N	4	62
257	\N	1	63
258	\N	1	64
280	\N	2	64
142	152	1	17
2	3	1	15
152	155	1	16
6	4	1	18
146	153	1	12
154	156	1	14
150	154	1	13
140	151	1	11
1	2	1	10
153	155	2	16
161	156	2	14
7	4	2	18
141	151	2	11
143	152	2	17
3	3	2	15
147	153	2	12
151	154	2	13
148	153	3	12
162	156	3	14
144	152	3	17
4	3	3	15
163	156	4	14
5	3	4	15
145	152	4	17
149	153	4	12
\.


--
-- Name: chordcharts_line_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('chordcharts_line_id_seq', 297, true);


--
-- Data for Name: chordcharts_measure; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY chordcharts_measure (id, line_id, beat_schema, number) FROM stdin;
446	246	4	4
448	246	2-2	6
111	140	4	1
112	140	4	2
113	140	4	3
114	140	4	4
115	140	4	5
116	140	2-2	6
117	140	4	7
1	1	2-2	1
118	140	4	8
2	1	2-2	2
120	141	4	2
3	1	2-2	3
4	1	2-2	4
122	141	4	4
119	141	2-2	1
121	141	2-2	3
5	2	4	1
123	141	2-2	5
124	141	2-2	6
8	2	4	3
125	141	4	7
9	2	4	4
7	2	4	2
126	141	4	8
10	2	4	5
127	142	4	1
128	142	4	2
11	2	2-1-1	6
129	142	4	3
12	2	4	7
14	3	4	1
13	2	4	8
15	3	4	2
188	149	4	6
16	3	4	3
17	3	4	4
189	149	4	7
18	3	4	5
190	149	4	8
19	3	4	6
191	150	4	1
132	142	4	6
192	150	4	2
193	150	4	3
130	142	4	4
131	142	4	5
194	150	4	4
134	142	2-1-1	8
133	142	4	7
135	143	4	1
136	143	4	2
137	143	4	3
138	143	4	4
139	143	4	5
140	143	4	6
141	143	4	7
142	143	4	8
143	144	4	1
144	144	4	2
145	144	4	3
146	144	4	4
147	144	4	5
148	144	4	6
149	144	4	7
195	150	4	5
150	144	2-1-1	8
151	145	4	1
152	145	4	2
153	145	4	3
154	145	4	4
155	145	4	5
156	145	4	6
157	145	4	7
158	145	4	8
20	3	4	7
159	146	4	1
21	3	4	8
22	4	4	1
162	146	4	4
161	146	2-2	3
23	4	4	2
163	146	2-2	5
24	4	4	3
167	147	4	1
164	146	2-2	6
197	150	4	7
25	4	4	4
168	147	4	2
169	147	4	3
170	147	4	4
171	147	4	5
26	4	4	5
172	147	4	6
173	147	4	7
27	4	2-1-1	6
174	147	4	8
175	148	4	1
176	148	4	2
31	5	4	4
29	4	4	8
177	148	2-2	3
178	148	4	4
28	4	4	7
179	148	2-2	5
30	5	4	4
180	148	2-2	6
32	6	2-2	1
181	148	4	7
182	148	4	8
183	149	4	1
165	146	4	7
166	146	2-2	8
184	149	4	2
33	6	2-2	2
185	149	4	3
186	149	4	4
187	149	4	5
34	6	2-2	3
198	150	4	8
199	151	4	1
222	153	4	8
35	6	2-2	4
196	150	4	6
200	151	4	2
201	151	4	3
202	151	4	4
203	151	4	5
36	6	2-2	5
204	151	4	6
205	151	4	7
206	151	4	8
207	152	4	1
208	152	4	2
37	6	4	6
38	6	4	7
40	7	2-2	1
39	6	4	8
209	152	4	3
41	7	2-2	2
210	152	4	4
42	7	2-2	3
211	152	4	5
43	7	2-2	4
44	7	4	5
213	152	4	7
45	7	4	6
212	152	2-2	6
46	7	4	7
47	7	4	8
214	152	4	8
215	153	4	1
216	153	4	2
217	153	4	3
218	153	4	4
219	153	4	5
220	153	4	6
221	153	4	7
223	154	4	1
224	154	4	2
225	154	4	3
226	154	4	4
227	154	4	5
228	154	4	6
229	154	4	7
230	154	4	8
449	246	4	7
450	246	2-2	8
451	247	4	1
160	146	4	2
453	247	4	3
454	247	4	4
455	247	4	5
445	246	4	3
447	246	4	5
444	246	4	2
456	247	2-2	6
457	247	4	7
458	247	2-2	8
514	255	2-1-1	4
395	240	4	1
396	240	4	2
397	240	4	3
398	240	4	4
399	240	4	5
400	240	2-2	6
401	240	4	7
403	241	4	1
402	240	2-2	8
406	241	4	4
407	241	4	5
408	241	4	6
410	241	4	8
409	241	2-2	7
411	242	4	1
412	242	4	2
413	242	4	3
414	242	4	4
279	161	4	1
280	161	4	2
281	161	4	3
282	161	4	4
283	161	4	5
284	161	4	6
285	161	4	7
286	161	4	8
287	162	4	1
288	162	4	2
289	162	4	3
290	162	4	4
291	162	4	5
292	162	4	6
293	162	4	7
294	162	4	8
295	163	4	1
296	163	4	2
297	163	4	3
298	163	4	4
299	163	4	5
300	163	4	6
301	163	4	7
302	163	4	8
415	242	4	5
416	242	2-2	6
417	242	4	7
418	242	2-2	8
419	243	4	1
421	243	4	3
422	243	4	4
423	243	4	5
424	243	2-2	6
515	255	4	5
425	243	2-2	7
426	243	2-2	8
516	255	4	6
404	241	2-2	2
420	243	2-2	2
452	247	2-2	2
440	245	4	6
517	255	4	7
405	241	4	3
518	255	4	8
459	248	2-2	1
460	248	2-2	2
461	248	2-2	3
462	248	2-2	4
463	249	4	1
464	249	4	2
465	249	4	3
519	256	4	1
520	256	4	2
435	245	4	1
436	245	2-2	2
437	245	4	3
438	245	2-2	4
439	245	4	5
521	256	4	3
441	245	4	7
442	245	4	8
443	246	4	1
466	249	2-2	4
467	249	4	5
468	249	2-2	6
469	249	2-2	7
470	249	4	8
471	250	4	1
472	250	4	2
473	250	4	3
475	250	4	5
478	250	4	8
474	250	2-2	4
476	250	2-2	6
477	250	2-2	7
479	251	4	1
480	251	4	2
481	251	4	3
482	251	2-1-1	4
483	251	4	5
484	251	4	6
485	251	4	7
486	251	4	8
487	252	4	1
488	252	4	2
489	252	4	3
490	252	2-2	4
491	252	4	5
492	252	2-2	6
493	252	2-2	7
494	252	4	8
495	253	4	1
496	253	4	2
497	253	4	3
498	253	2-2	4
499	253	4	5
500	253	2-2	6
501	253	2-2	7
502	253	4	8
503	254	4	1
504	254	4	2
505	254	4	3
507	254	4	5
510	254	4	8
506	254	2-2	4
508	254	2-2	6
509	254	2-2	7
511	255	4	1
512	255	4	2
513	255	4	3
523	256	4	5
526	256	4	8
522	256	2-2	4
524	256	2-2	6
525	256	2-2	7
527	257	4	1
528	257	4	2
529	257	4	3
530	257	4	4
531	257	4	5
532	257	4	6
534	257	4	8
533	257	2-2	7
535	258	4	1
536	258	4	2
537	258	4	3
538	258	4	4
539	258	4	5
540	258	4	6
541	258	4	7
542	258	2-2	8
570	280	4	1
571	280	4	2
572	280	4	3
574	280	4	5
575	280	2-2	6
576	280	2-2	7
573	280	2-2	4
577	280	2-2	8
\.


--
-- Name: chordcharts_measure_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('chordcharts_measure_id_seq', 602, true);


--
-- Data for Name: chordcharts_note; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY chordcharts_note (id, name, key_id, distance_from_root, key_note) FROM stdin;
2	C	1	0	t
3	C#	1	1	f
4	D	1	2	t
5	Eb	1	3	f
6	E	1	4	t
7	F	1	5	t
8	F#	1	6	f
9	F	2	0	t
10	F#	2	1	f
11	G	2	2	t
12	Ab	2	3	f
13	A	2	4	t
14	Bb	2	5	t
15	B	2	6	f
16	G	1	7	t
17	Ab	1	8	f
18	A	1	9	t
19	Bb	1	10	f
20	B	1	11	t
21	C	2	7	t
22	C#	2	8	f
23	D	2	9	t
24	Eb	2	10	f
25	E	2	11	t
26	G	3	0	t
27	Ab	3	1	f
28	A	3	2	t
29	Bb	3	3	f
30	B	3	4	t
31	C	3	5	t
32	C#	3	6	f
33	D	3	7	t
34	Eb	3	8	f
35	E	3	9	t
36	F	3	10	f
37	F#	3	11	t
38	A	4	0	t
39	Bb	4	1	f
40	B	4	2	t
41	C	4	3	f
42	C#	4	4	t
43	D	4	5	t
44	Eb	4	6	f
45	E	4	7	t
46	F	4	8	f
47	F#	4	9	t
48	G	4	10	f
49	G#	4	11	t
50	C#	5	0	t
51	D	5	1	f
52	D#	5	2	t
53	E	5	3	f
54	E#	5	4	t
56	F#	5	5	t
57	G	5	6	f
58	G#	5	7	t
59	A	5	8	f
60	A#	5	9	t
61	B	5	10	f
62	B#	5	11	t
63	Bb	6	0	t
64	B	6	1	f
65	C	6	2	t
66	C#	6	3	f
67	D	6	4	t
68	Eb	6	5	t
69	E	6	6	f
70	F	6	7	t
71	F#	6	8	f
72	G	6	9	t
73	Ab	6	10	f
74	A	6	11	t
75	D	7	0	t
76	Eb	7	1	f
77	E	7	2	t
78	F	7	3	f
79	F#	7	4	t
80	G	7	5	t
81	Ab	7	6	f
82	A	7	7	t
83	Bb	7	8	f
84	B	7	9	t
85	C	7	10	f
86	C#	7	11	t
87	E	8	0	t
88	F	8	1	f
89	F#	8	2	t
90	G	8	3	f
91	Ab	8	4	t
92	A	8	5	t
93	Bb	8	6	f
94	B	8	7	t
95	C	8	8	f
96	C#	8	9	t
97	D	8	10	t
98	Eb	8	11	t
\.


--
-- Name: chordcharts_note_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('chordcharts_note_id_seq', 98, true);


--
-- Data for Name: chordcharts_section; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY chordcharts_section (id, chart_id, key_distance_from_chart, alt_name, number, time_signature_id, use_subsections) FROM stdin;
3	1	0		2	1	f
151	2	0	Intro	1	1	f
152	2	0	Chorus	2	1	f
154	4	0		1	1	f
155	4	0		2	1	f
4	1	0		3	1	f
2	1	0	Intro	1	1	f
156	5	0		1	1	t
203	6	0		1	1	f
205	7	0	Intro	1	1	f
207	7	0		3	1	f
208	7	0	Bridge	4	1	f
206	7	0	First round	2	1	f
209	8	0		1	1	f
153	3	0		1	1	f
\.


--
-- Name: chordcharts_section_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('chordcharts_section_id_seq', 241, true);


--
-- Data for Name: chordcharts_subsection; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY chordcharts_subsection (id, number, section_id, letter) FROM stdin;
10	1	2	A
11	1	151	A
12	1	153	A
13	1	154	A
14	1	156	A
15	1	3	A
16	1	155	A
17	1	152	A
18	1	4	A
58	1	203	A
60	1	205	A
61	1	206	A
62	1	207	A
63	1	208	A
64	1	209	A
\.


--
-- Name: chordcharts_subsection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('chordcharts_subsection_id_seq', 64, true);


--
-- Data for Name: chordcharts_timesignature; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY chordcharts_timesignature (id, beats, beat_unit) FROM stdin;
1	4	4
2	4	3
3	6	8
4	2	2
\.


--
-- Name: chordcharts_timesignature_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('chordcharts_timesignature_id_seq', 4, true);


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY django_admin_log (id, action_time, user_id, content_type_id, object_id, object_repr, action_flag, change_message) FROM stdin;
1	2013-08-09 08:51:07.810716+02	1	16	1	Measure 1	2	Changed chord_type for chord "A-7".
2	2013-08-09 08:51:55.522292+02	1	15	1	Line 1	2	Added measure "Measure 3". Added measure "Measure 4".
3	2013-08-09 08:53:02.104787+02	1	16	3	Measure 3	2	Added chord "C6/9". Added chord "A-7".
4	2013-08-09 08:53:52.147692+02	1	16	4	Measure 4	2	Added chord "F△7". Added chord "G△7".
5	2013-08-09 08:54:21.004885+02	1	13	1	J'attendrai	2	Added section "A".
6	2013-08-09 08:54:34.305523+02	1	14	3	A	2	Added line "Line 1".
7	2013-08-09 08:54:57.326978+02	1	15	2	Line 1	2	Added measure "Measure 1".
8	2013-08-09 08:55:43.429727+02	1	15	2	Line 1	2	Added measure "Measure 1". Added measure "Measure 2". Added measure "Measure 3". Added measure "Measure 4". Added measure "Measure 5". Added measure "Measure 6". Added measure "Measure 7". Added measure "Measure 8".
9	2013-08-09 08:56:38.348693+02	1	15	2	Line 1	2	Deleted measure "Measure 1".
10	2013-08-09 08:57:20.629859+02	1	16	5	Measure 1	2	Added chord "C6/9".
11	2013-08-09 08:57:45.088025+02	1	16	7	Measure 2	2	Added chord "C6/9".
12	2013-08-09 08:58:02.712095+02	1	16	8	Measure 3	2	Added chord "C6/9".
13	2013-08-09 09:00:12.327463+02	1	16	9	Measure 4	2	Added chord "F9".
14	2013-08-09 09:00:40.261706+02	1	16	10	Measure 5	2	Added chord "C△7".
15	2013-08-09 09:02:13.100932+02	1	16	11	Measure 6	2	Added chord "C△7". Added chord "C/E".
16	2013-08-09 09:03:40.477396+02	1	16	11	Measure 6	2	Added chord "Eb° ".
17	2013-08-09 09:15:10.541731+02	1	16	12	Measure 7	2	Added chord "D-7".
18	2013-08-09 09:15:58.902903+02	1	16	13	Measure 8	2	Added chord "A9".
19	2013-08-09 09:16:18.957957+02	1	14	3	A	2	Added line "Line 2".
20	2013-08-09 09:17:09.713629+02	1	15	3	Line 2	2	Added measure "Measure 1". Added measure "Measure 2". Added measure "Measure 3". Added measure "Measure 4". Added measure "Measure 5". Added measure "Measure 6". Added measure "Measure 7". Added measure "Measure 8".
21	2013-08-09 09:17:28.142245+02	1	16	14	Measure 1	2	Added chord "Dm".
22	2013-08-09 09:17:57.223624+02	1	16	15	Measure 2	2	Added chord "D-△".
23	2013-08-09 09:18:15.652724+02	1	16	16	Measure 3	2	Added chord "D-7".
24	2013-08-09 09:18:57.875686+02	1	16	17	Measure 4	2	Added chord "F#7".
25	2013-08-09 09:19:13.159119+02	1	16	18	Measure 5	2	Added chord "Dm".
26	2013-08-09 09:19:28.104114+02	1	16	19	Measure 6	2	Added chord "F#7".
27	2013-08-09 09:19:46.925416+02	1	16	20	Measure 7	2	Added chord "C6/9".
28	2013-08-09 09:20:03.711276+02	1	16	21	Measure 8	2	Added chord "C6/9".
29	2013-08-09 09:20:30.261499+02	1	16	17	Measure 4	2	Changed chord_pitch for chord "G7".
30	2013-08-09 09:20:39.408372+02	1	16	19	Measure 6	2	Changed chord_pitch for chord "G7".
31	2013-08-09 16:39:04.428312+02	1	16	7	Measure 2	2	Changed alt_bass for chord "C6/9/C".
32	2013-08-09 16:39:41.982113+02	1	16	7	Measure 2	2	Changed alt_bass and alt_bass_pitch for chord "C6/9".
33	2013-08-09 16:39:52.881402+02	1	16	7	Measure 2	2	Changed alt_bass for chord "C6/9/C#".
34	2013-08-09 16:40:05.856152+02	1	16	7	Measure 2	2	Changed alt_bass and alt_bass_pitch for chord "C6/9".
35	2013-08-09 17:10:06.505324+02	1	18	1	TimeSignature object	1	
36	2013-08-09 17:10:09.690724+02	1	18	2	TimeSignature object	1	
37	2013-08-09 17:10:18.23897+02	1	18	3	TimeSignature object	1	
38	2013-08-09 17:10:24.13541+02	1	18	4	TimeSignature object	1	
39	2013-08-09 17:12:37.135265+02	1	18	1	4/4	1	
40	2013-08-09 17:12:41.065275+02	1	18	2	4/3	1	
41	2013-08-09 17:12:46.121629+02	1	18	3	6/8	1	
42	2013-08-09 17:12:51.69404+02	1	18	4	2/2	1	
43	2013-08-09 17:28:33.415026+02	1	14	3	A	2	Added line "Line 3".
44	2013-08-09 17:29:17.72897+02	1	15	4	Line 3	2	Added measure "Measure 1". Added measure "Measure 2". Added measure "Measure 3". Added measure "Measure 4". Added measure "Measure 5". Added measure "Measure 6". Added measure "Measure 7". Added measure "Measure 8".
45	2013-08-09 17:29:36.790756+02	1	16	22	Measure 1	2	Added chord "A7".
46	2013-08-09 17:29:58.621276+02	1	16	23	Measure 2	2	Added chord "C-7".
47	2013-08-09 17:30:18.354208+02	1	16	24	Measure 3	2	Added chord "F6/9".
48	2013-08-09 17:30:50.210414+02	1	16	22	Measure 1	2	Changed chord_pitch for chord "C7".
49	2013-08-09 17:31:03.216747+02	1	16	23	Measure 2	2	Changed chord_type for chord "C7".
50	2013-08-09 17:31:34.230924+02	1	16	25	Measure 4	2	Added chord "D0̸ ".
51	2013-08-09 17:32:07.697703+02	1	16	26	Measure 5	2	Added chord "C6/9".
52	2013-08-09 17:33:02.039156+02	1	16	27	Measure 6	2	Added chord "C6/9". Added chord "E-7". Added chord "Eb-7".
53	2013-08-09 17:33:30.309796+02	1	16	28	Measure 7	2	Added chord "D-7".
54	2013-08-09 17:33:57.934737+02	1	16	29	Measure 8	2	Added chord "F#7".
55	2013-08-09 17:34:12.263462+02	1	16	29	Measure 8	2	Changed chord_pitch for chord "G7".
56	2013-08-09 17:34:43.416808+02	1	14	3	A	2	Added line "Line 4".
57	2013-08-09 17:35:01.88448+02	1	15	5	Line 4	2	Added measure "Measure 4". Added measure "Measure 4".
58	2013-08-09 17:35:27.899528+02	1	16	30	Measure 4	2	Added chord "C6/9".
59	2013-08-09 17:35:54.14275+02	1	16	31	Measure 4	2	Added chord "G7+5".
60	2013-08-09 17:37:32.695285+02	1	13	1	J'attendrai	2	Added section "B".
61	2013-08-09 17:38:10.606127+02	1	14	4	B	2	Added line "Line 1". Added line "Line 2".
62	2013-08-09 17:39:23.014181+02	1	15	6	Line 1	2	Added measure "Measure 1". Added measure "Measure 2". Added measure "Measure 3". Added measure "Measure 4". Added measure "Measure 5". Added measure "Measure 6". Added measure "Measure 7". Added measure "Measure 8".
63	2013-08-09 17:40:14.711491+02	1	16	32	Measure 1	2	Added chord "C6/9". Added chord "A-7".
64	2013-08-09 17:41:20.466581+02	1	16	33	Measure 2	2	Added chord "D-7". Added chord "G7".
65	2013-08-09 17:42:05.493044+02	1	16	34	Measure 3	2	Added chord "C6/9". Added chord "A7+5".
66	2013-08-09 17:42:54.053238+02	1	16	35	Measure 4	2	Added chord "D-7". Added chord "G7".
67	2013-08-09 17:43:51.936752+02	1	16	36	Measure 5	2	Added chord "Em". Added chord "A7+5".
68	2013-08-09 17:44:09.266225+02	1	16	37	Measure 6	2	Added chord "D7".
69	2013-08-09 17:44:30.707871+02	1	16	38	Measure 7	2	Added chord "E-7".
70	2013-08-09 17:44:49.086016+02	1	16	39	Measure 8	2	Added chord "G7".
71	2013-08-09 17:45:04.771183+02	1	16	38	Measure 7	2	Changed chord_pitch for chord "D-7".
72	2013-08-09 17:45:50.074944+02	1	15	7	Line 2	2	Added measure "Measure 1". Added measure "Measure 2". Added measure "Measure 3". Added measure "Measure 4". Added measure "Measure 5". Added measure "Measure 6". Added measure "Measure 7". Added measure "Measure 8".
73	2013-08-09 17:50:38.152197+02	1	16	40	Measure 1	2	Added chord "C6/9". Added chord "A-7".
74	2013-08-09 17:51:11.987306+02	1	16	41	Measure 2	2	Added chord "D-7". Added chord "G7".
75	2013-08-09 17:52:17.4583+02	1	16	42	Measure 3	2	Added chord "C6/9". Added chord "A7+5".
76	2013-08-09 17:55:01.201468+02	1	16	43	Measure 4	2	Added chord "A7". Added chord "D-7".
77	2013-08-09 17:55:22.669491+02	1	16	44	Measure 5	2	Added chord "Bb".
78	2013-08-09 17:55:43.847243+02	1	16	44	Measure 5	2	Changed chord_pitch for chord "F".
79	2013-08-09 17:56:08.781061+02	1	16	45	Measure 6	2	Added chord "F#° ".
80	2013-08-09 17:56:30.016581+02	1	16	46	Measure 7	2	Added chord "G7".
81	2013-08-09 17:56:46.150874+02	1	16	47	Measure 8	2	Added chord "G7".
82	2014-04-29 17:59:59.873654+02	1	15	8	Line 1	3	
83	2014-05-03 14:58:34.32159+02	1	12	10	Diminished (°)	2	Changed symbol and chord_output.
84	2014-05-04 12:05:37.194539+02	1	9	2	I'll See You In My Dreams	1	
85	2014-05-04 12:06:15.31777+02	1	13	2	I'll See You In My Dreams	1	
86	2014-05-04 12:07:34.240898+02	1	13	2	I'll See You In My Dreams	2	Added section "A Section".
87	2014-05-04 12:07:47.657955+02	1	14	151	A Section	2	Added line "Line 1".
88	2014-05-04 12:08:07.351468+02	1	15	140	Line 1	2	Added measure "Measure 1".
89	2014-05-04 12:08:32.903211+02	1	16	111	Measure 1	2	Added chord "F".
90	2014-05-04 12:46:10.679201+02	1	9	3	I'll Be Seeing You	1	
91	2014-05-04 12:47:16.136689+02	1	13	3	I'll Be Seeing You	1	
92	2014-05-04 12:47:30.351036+02	1	14	153	A Section	2	Added line "Line 1".
93	2014-05-04 12:47:42.422486+02	1	15	146	Line 1	2	Added measure "Measure 1".
94	2014-05-04 12:48:01.038122+02	1	16	159	Measure 1	2	Added chord "C".
95	2014-05-04 12:56:00.700592+02	1	13	3	I'll Be Seeing You	2	Changed key.
96	2014-05-04 13:33:46.126726+02	1	12	23	Minor Ninth (-9)	1	
97	2014-05-04 13:34:00.446326+02	1	12	11	Half Diminished (0̸ )	2	Changed order.
98	2014-05-04 13:34:12.432578+02	1	12	11	Half Diminished (0̸ )	2	Changed order.
99	2014-05-04 13:34:21.732379+02	1	12	16	Dominant Seventh with Sharpened Fifth (7#5)	2	Changed order.
100	2014-05-04 13:34:29.165246+02	1	12	17	Dominant Seventh with Flattened Fifth (7b5)	2	Changed order.
101	2014-05-04 13:34:36.588226+02	1	12	14	Seventh with Sharpened Ninth (7#9)	2	Changed order.
102	2014-05-04 13:34:39.766287+02	1	12	14	Seventh with Sharpened Ninth (7#9)	2	Changed order.
103	2014-05-04 13:34:46.584433+02	1	12	15	Seventh with Flattened Ninth (7b9)	2	Changed order.
104	2014-05-04 13:34:53.420147+02	1	12	21	Eleventh (11)	2	Changed order.
105	2014-05-04 13:34:58.940712+02	1	12	20	Thirteenth (13)	2	Changed order.
106	2014-05-04 13:35:04.45802+02	1	12	12	Minor Major (-△)	2	Changed order.
107	2014-05-04 13:35:08.76833+02	1	12	18	Seventh with Sharpened Ninth and Sharpened Fifth (7#9#5)	2	Changed order.
108	2014-05-04 13:35:14.124398+02	1	12	18	Seventh with Sharpened Ninth and Sharpened Fifth (7#9#5)	2	Changed order.
109	2014-05-04 13:35:30.840772+02	1	12	10	Diminished (°)	2	Changed order.
110	2014-05-04 13:35:39.234474+02	1	12	23	Minor Ninth (-9)	2	Changed order.
111	2014-05-04 14:20:57.018765+02	1	9	4	I Love Paris	1	
112	2014-05-04 14:21:10.432177+02	1	13	4	I Love Paris	1	
113	2014-05-04 14:21:24.134596+02	1	14	154	A Section	2	Added line "Line 1".
114	2014-05-04 14:21:35.637715+02	1	15	150	Line 1	2	Added measure "Measure 1".
115	2014-05-04 14:21:53.471405+02	1	16	191	Measure 1	2	Added chord "Gm".
116	2014-05-04 15:59:57.56378+02	1	9	5	All By Myself	1	
117	2014-05-04 16:00:27.551427+02	1	13	5	All By Myself	1	
118	2014-05-04 16:03:57.023812+02	1	14	156	A Section	2	Added line "Line 1".
119	2014-05-04 16:04:09.302428+02	1	15	154	Line 1	2	Added measure "Measure 1".
120	2014-05-04 16:09:06.254135+02	1	10	8	E Major	2	Added note "E". Added note "F". Added note "F#". Added note "G". Added note "Ab". Added note "A". Added note "Bb". Added note "B". Added note "C". Added note "C#". Added note "D". Added note "Eb".
121	2014-05-04 16:09:09.683663+02	1	16	223	Measure 1	2	Added chord "E".
122	2014-05-12 20:42:00.577792+02	1	13	5	All By Myself	2	Changed use_subsections for section "A Section".
123	2014-05-17 13:50:01.367117+02	1	9	6	I've Got My Love To Keep Me Warm	1	
124	2014-05-17 13:50:23.969225+02	1	13	6	I've Got My Love To Keep Me Warm	1	
125	2014-05-17 13:50:42.084228+02	1	14	203	A Section	2	Added subsection "Subsection 1".
126	2014-05-17 13:50:53.199348+02	1	19	58	Subsection 1	2	Added line "Line 1".
127	2014-05-17 13:51:07.036412+02	1	15	240	Line 1	2	Added measure "Measure 1".
128	2014-05-17 13:51:29.21101+02	1	16	395	Measure 1	2	Added chord "C".
129	2014-05-17 16:37:18.674005+02	1	13	6	I've Got My Love To Keep Me Warm	2	Changed key.
130	2014-05-17 17:26:29.120714+02	1	9	7	My Girl's Pussy	1	
131	2014-05-17 17:26:54.809113+02	1	13	7	My Girl's Pussy	1	
132	2014-05-17 17:27:07.028787+02	1	14	205	A Section	2	Added subsection "Subsection 1".
133	2014-05-17 17:27:19.994631+02	1	19	60	Subsection 1	2	Added line "Line 1".
134	2014-05-17 17:27:31.047764+02	1	15	248	Line 1	2	Added measure "Measure 1".
135	2014-05-17 17:27:47.295816+02	1	16	459	Measure 1	2	Added chord "G".
136	2014-05-18 12:02:27.840698+02	1	9	8	Who Loves You	1	
137	2014-05-18 12:02:43.963446+02	1	13	8	Who Loves You	1	
138	2014-05-18 12:03:14.608081+02	1	14	209	A Section	2	Added subsection "Subsection 1".
139	2014-05-18 12:03:25.879144+02	1	19	64	Subsection 1	2	Added line "Line 1".
140	2014-05-18 12:03:35.637321+02	1	15	258	Line 1	2	Added measure "Measure 1".
141	2014-05-18 12:03:49.902305+02	1	16	535	Measure 1	2	Added chord "C".
\.


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('django_admin_log_id_seq', 141, true);


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY django_content_type (id, name, app_label, model) FROM stdin;
1	permission	auth	permission
2	group	auth	group
3	user	auth	user
4	content type	contenttypes	contenttype
5	session	sessions	session
6	site	sites	site
7	log entry	admin	logentry
8	migration history	south	migrationhistory
9	song	songs	song
10	key	chordcharts	key
11	note	chordcharts	note
12	chord type	chordcharts	chordtype
13	chart	chordcharts	chart
14	section	chordcharts	section
15	line	chordcharts	line
16	measure	chordcharts	measure
17	chord	chordcharts	chord
18	time signature	chordcharts	timesignature
19	subsection	chordcharts	subsection
\.


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('django_content_type_id_seq', 19, true);


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY django_migrations (id, app, name, applied) FROM stdin;
1	chordcharts	0001_initial	2014-05-12 19:29:51.672086+02
2	chordcharts	0002_section	2014-05-12 19:29:51.807087+02
3	chordcharts	0003_subsection	2014-05-12 19:29:51.817813+02
4	chordcharts	0004_line	2014-05-12 19:29:51.830631+02
5	chordcharts	0005_measure	2014-05-12 19:29:51.848522+02
6	chordcharts	0006_chord	2014-05-12 19:29:51.870469+02
7	chordcharts	0007_auto_20140512_1248	2014-05-12 19:49:04.961892+02
\.


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('django_migrations_id_seq', 7, true);


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY django_session (session_key, session_data, expire_date) FROM stdin;
g58jz0vat75lrucs54cjmj9e27cyg16c	ZTY0NzE4M2ZmNmE2ZDUwZThhZjQ3NThjZGE2OGE4ZDNlYzQ2N2Q4MzqAAn1xAShVEl9hdXRoX3VzZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHEDVQ1fYXV0aF91c2VyX2lkcQRLAXUu	2013-08-23 08:50:29.681137+02
2qahwe4r36xh6eungqaj45jr04pq2hcb	ZTY0NzE4M2ZmNmE2ZDUwZThhZjQ3NThjZGE2OGE4ZDNlYzQ2N2Q4MzqAAn1xAShVEl9hdXRoX3VzZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHEDVQ1fYXV0aF91c2VyX2lkcQRLAXUu	2013-08-23 16:38:22.06847+02
msi0nhbjlsa68jkcw6ocxf5739hb1prx	ZTY0NzE4M2ZmNmE2ZDUwZThhZjQ3NThjZGE2OGE4ZDNlYzQ2N2Q4MzqAAn1xAShVEl9hdXRoX3VzZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHEDVQ1fYXV0aF91c2VyX2lkcQRLAXUu	2013-09-01 21:17:28.626587+02
b19ajpudx1ogdsa41z3h8m6zd1dp2n83	ZTY0NzE4M2ZmNmE2ZDUwZThhZjQ3NThjZGE2OGE4ZDNlYzQ2N2Q4MzqAAn1xAShVEl9hdXRoX3VzZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHEDVQ1fYXV0aF91c2VyX2lkcQRLAXUu	2014-04-21 17:54:22.972346+02
zp3ogh0dt2rv3bhm1jr2d1gx53v4z8j9	ZTY0NzE4M2ZmNmE2ZDUwZThhZjQ3NThjZGE2OGE4ZDNlYzQ2N2Q4MzqAAn1xAShVEl9hdXRoX3VzZXJfYmFja2VuZHECVSlkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZHEDVQ1fYXV0aF91c2VyX2lkcQRLAXUu	2014-04-29 23:22:10.982273+02
acjgm83a4ynins79szznf6if7adfe6pv	MWFmMzU0MTQ3YWE5MzI3MDQ0ZjI3M2UxM2Q4MmJjYzQ2ZjBmZDllNzp7Il9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9pZCI6MX0=	2014-05-10 17:49:53.109576+02
5yjgy4mrm20q8yg59o5um63p1irjgvia	MWFmMzU0MTQ3YWE5MzI3MDQ0ZjI3M2UxM2Q4MmJjYzQ2ZjBmZDllNzp7Il9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9pZCI6MX0=	2014-05-13 17:55:36.861041+02
h5xikcuft46q5k6bnl0t9d43ndf0deh5	NDkxNmMzNjZjNDc5OTQzNTg0N2YyZWQxMjNiOGY5MWY2OGQ5N2EyYzp7fQ==	2014-05-21 09:44:55.185093+02
3szln8yzvonx80tiaz9td9wepbya43xh	N2MyZWUzMTAzM2E3OTIxY2JmNDA2M2M0NjdlZTJhOWUwZGM5MjhlODp7Il9hdXRoX3VzZXJfYmFja2VuZCI6ImRqYW5nby5jb250cmliLmF1dGguYmFja2VuZHMuTW9kZWxCYWNrZW5kIiwiX2F1dGhfdXNlcl9pZCI6MSwiX2F1dGhfdXNlcl9oYXNoIjoiYjUwODBmNTRmZTk5OWFlYmJiMzdkMTdjYjdlNDI1NWE5ZTEwZDcyYSJ9	2014-05-21 18:17:37.351624+02
ceube4ce376unypzt8j9hp3ynxhnq69n	NDkxNmMzNjZjNDc5OTQzNTg0N2YyZWQxMjNiOGY5MWY2OGQ5N2EyYzp7fQ==	2014-05-23 08:55:32.775474+02
0w36w7jyuxrb5ey5q0ig9wz08ec2gp3o	MTdiMjgxYjUyNDU2ZTEwMjU5ZTA4ZjBlOWJhMDIwNDZkMzNkYTRlMDp7Il9hdXRoX3VzZXJfaGFzaCI6ImI1MDgwZjU0ZmU5OTlhZWJiYjM3ZDE3Y2I3ZTQyNTVhOWUxMGQ3MmEiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCIsIl9hdXRoX3VzZXJfaWQiOjF9	2014-05-26 09:04:26.726912+02
0199ptmg9aezj68ef88woc6p51rqmllo	NDkxNmMzNjZjNDc5OTQzNTg0N2YyZWQxMjNiOGY5MWY2OGQ5N2EyYzp7fQ==	2014-05-28 18:38:45.93722+02
zk862aha401kl878cca7x528dd81r8sg	Y2YyMWQ5OWVjOTc3NzRlMjM3MDI3ZmFlYjAwNTIxMmI2NGNhMWE3NDp7Il9hdXRoX3VzZXJfaWQiOjEsIl9hdXRoX3VzZXJfaGFzaCI6ImI1MDgwZjU0ZmU5OTlhZWJiYjM3ZDE3Y2I3ZTQyNTVhOWUxMGQ3MmEiLCJfYXV0aF91c2VyX2JhY2tlbmQiOiJkamFuZ28uY29udHJpYi5hdXRoLmJhY2tlbmRzLk1vZGVsQmFja2VuZCJ9	2014-05-31 13:49:32.141158+02
\.


--
-- Data for Name: django_site; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY django_site (id, domain, name) FROM stdin;
1	example.com	example.com
\.


--
-- Name: django_site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('django_site_id_seq', 1, true);


--
-- Data for Name: songs_song; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY songs_song (id, name, slug) FROM stdin;
1	J'attendrai	jattendrai
2	I'll See You In My Dreams	ill-see-you-my-dreams
3	I'll Be Seeing You	ill-be-seeing-you
4	I Love Paris	i-love-paris
5	All By Myself	all-by-myself
6	I've Got My Love To Keep Me Warm	ive-got-my-love-keep-me-warm
7	My Girl's Pussy	my-girls-pussy
8	Who Loves You	who-loves-you
\.


--
-- Name: songs_song_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('songs_song_id_seq', 8, true);


--
-- Data for Name: south_migrationhistory; Type: TABLE DATA; Schema: public; Owner: Rik
--

COPY south_migrationhistory (id, app_name, migration, applied) FROM stdin;
1	chordcharts	0001_initial	2013-08-09 08:49:43.028027+02
2	chordcharts	0002_auto__del_field_section_line_width	2013-08-09 08:49:43.043801+02
3	chordcharts	0003_auto__add_field_line_position	2013-08-09 08:49:43.062644+02
4	chordcharts	0004_auto__del_field_measure_position__add_field_measure_number__del_field_	2013-08-09 08:49:43.123728+02
5	chordcharts	0005_auto__chg_field_chord_measure	2013-08-09 08:49:43.159594+02
6	chordcharts	0006_auto__del_field_chord_alternative_bass_pitch__del_field_chord_alternat	2013-08-09 08:49:43.186035+02
9	chordcharts	0007_auto__add_timesignature__add_field_section_time_signature	2013-08-09 17:08:29.06028+02
10	chordcharts	0007_auto__add_timesignature	2013-08-09 17:12:30.342698+02
12	chordcharts	0008_auto__add_field_section_time_signature	2013-08-09 17:17:24.899132+02
13	chordcharts	0009_rename_alt_title_to_alt_name	2014-04-08 08:55:15.707589+02
14	chordcharts	0010_auto__del_field_section_alt_title__add_field_section_alt_name__del_uni	2014-04-26 23:26:34.89693+02
15	chordcharts	0011_auto__add_subsection	2014-05-04 17:48:55.136768+02
18	chordcharts	0012_auto__add_field_line_subsection	2014-05-04 18:02:35.078986+02
19	chordcharts	0013_subsections	2014-05-04 18:10:35.117181+02
\.


--
-- Name: south_migrationhistory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: Rik
--

SELECT pg_catalog.setval('south_migrationhistory_id_seq', 19, true);


--
-- Name: auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions_group_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_key UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission_content_type_id_codename_key; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_key UNIQUE (content_type_id, codename);


--
-- Name: auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups_user_id_group_id_key; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_key UNIQUE (user_id, group_id);


--
-- Name: auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions_user_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_key UNIQUE (user_id, permission_id);


--
-- Name: auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: chordcharts_chart_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_chart
    ADD CONSTRAINT chordcharts_chart_pkey PRIMARY KEY (id);


--
-- Name: chordcharts_chord_order_52ea516228aec708_uniq; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_chord
    ADD CONSTRAINT chordcharts_chord_order_52ea516228aec708_uniq UNIQUE ("order", measure_id);


--
-- Name: chordcharts_chord_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_chord
    ADD CONSTRAINT chordcharts_chord_pkey PRIMARY KEY (id);


--
-- Name: chordcharts_chordtype_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_chordtype
    ADD CONSTRAINT chordcharts_chordtype_pkey PRIMARY KEY (id);


--
-- Name: chordcharts_key_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_key
    ADD CONSTRAINT chordcharts_key_pkey PRIMARY KEY (id);


--
-- Name: chordcharts_key_slug_key; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_key
    ADD CONSTRAINT chordcharts_key_slug_key UNIQUE (slug);


--
-- Name: chordcharts_key_tonality_68f9d0e484d4a275_uniq; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_key
    ADD CONSTRAINT chordcharts_key_tonality_68f9d0e484d4a275_uniq UNIQUE (tonality, "order");


--
-- Name: chordcharts_line_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_line
    ADD CONSTRAINT chordcharts_line_pkey PRIMARY KEY (id);


--
-- Name: chordcharts_measure_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_measure
    ADD CONSTRAINT chordcharts_measure_pkey PRIMARY KEY (id);


--
-- Name: chordcharts_note_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_note
    ADD CONSTRAINT chordcharts_note_pkey PRIMARY KEY (id);


--
-- Name: chordcharts_section_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_section
    ADD CONSTRAINT chordcharts_section_pkey PRIMARY KEY (id);


--
-- Name: chordcharts_subsection_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_subsection
    ADD CONSTRAINT chordcharts_subsection_pkey PRIMARY KEY (id);


--
-- Name: chordcharts_timesignature_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY chordcharts_timesignature
    ADD CONSTRAINT chordcharts_timesignature_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type_app_label_model_key; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_key UNIQUE (app_label, model);


--
-- Name: django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: django_site_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY django_site
    ADD CONSTRAINT django_site_pkey PRIMARY KEY (id);


--
-- Name: songs_song_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY songs_song
    ADD CONSTRAINT songs_song_pkey PRIMARY KEY (id);


--
-- Name: south_migrationhistory_pkey; Type: CONSTRAINT; Schema: public; Owner: Rik; Tablespace: 
--

ALTER TABLE ONLY south_migrationhistory
    ADD CONSTRAINT south_migrationhistory_pkey PRIMARY KEY (id);


--
-- Name: auth_group_name_like; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX auth_group_name_like ON auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX auth_group_permissions_group_id ON auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX auth_group_permissions_permission_id ON auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX auth_permission_content_type_id ON auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX auth_user_groups_group_id ON auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX auth_user_groups_user_id ON auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX auth_user_user_permissions_permission_id ON auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX auth_user_user_permissions_user_id ON auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_like; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX auth_user_username_like ON auth_user USING btree (username varchar_pattern_ops);


--
-- Name: chordcharts_chart_key_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_chart_key_id ON chordcharts_chart USING btree (key_id);


--
-- Name: chordcharts_chart_song_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_chart_song_id ON chordcharts_chart USING btree (song_id);


--
-- Name: chordcharts_chord_chord_type_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_chord_chord_type_id ON chordcharts_chord USING btree (chord_type_id);


--
-- Name: chordcharts_chord_measure_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_chord_measure_id ON chordcharts_chord USING btree (measure_id);


--
-- Name: chordcharts_key_slug_like; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_key_slug_like ON chordcharts_key USING btree (slug varchar_pattern_ops);


--
-- Name: chordcharts_line_section_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_line_section_id ON chordcharts_line USING btree (section_id);


--
-- Name: chordcharts_line_subsection_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_line_subsection_id ON chordcharts_line USING btree (subsection_id);


--
-- Name: chordcharts_measure_line_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_measure_line_id ON chordcharts_measure USING btree (line_id);


--
-- Name: chordcharts_note_key_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_note_key_id ON chordcharts_note USING btree (key_id);


--
-- Name: chordcharts_section_chart_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_section_chart_id ON chordcharts_section USING btree (chart_id);


--
-- Name: chordcharts_section_time_signature_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_section_time_signature_id ON chordcharts_section USING btree (time_signature_id);


--
-- Name: chordcharts_subsection_section_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX chordcharts_subsection_section_id ON chordcharts_subsection USING btree (section_id);


--
-- Name: django_admin_log_content_type_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX django_admin_log_content_type_id ON django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX django_admin_log_user_id ON django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX django_session_expire_date ON django_session USING btree (expire_date);


--
-- Name: django_session_session_key_like; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX django_session_session_key_like ON django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: songs_song_slug; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX songs_song_slug ON songs_song USING btree (slug);


--
-- Name: songs_song_slug_like; Type: INDEX; Schema: public; Owner: Rik; Tablespace: 
--

CREATE INDEX songs_song_slug_like ON songs_song USING btree (slug varchar_pattern_ops);


--
-- Name: auth_group_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chart_id_refs_id_1925bcef; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_section
    ADD CONSTRAINT chart_id_refs_id_1925bcef FOREIGN KEY (chart_id) REFERENCES chordcharts_chart(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: chord_type_id_refs_id_6f2066da; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_chord
    ADD CONSTRAINT chord_type_id_refs_id_6f2066da FOREIGN KEY (chord_type_id) REFERENCES chordcharts_chordtype(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: content_type_id_refs_id_d043b34a; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_permission
    ADD CONSTRAINT content_type_id_refs_id_d043b34a FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log_content_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_fkey FOREIGN KEY (content_type_id) REFERENCES django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: group_id_refs_id_f4b32aac; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_group_permissions
    ADD CONSTRAINT group_id_refs_id_f4b32aac FOREIGN KEY (group_id) REFERENCES auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: key_id_refs_id_566fa688; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_note
    ADD CONSTRAINT key_id_refs_id_566fa688 FOREIGN KEY (key_id) REFERENCES chordcharts_key(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: key_id_refs_id_a1318b54; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_chart
    ADD CONSTRAINT key_id_refs_id_a1318b54 FOREIGN KEY (key_id) REFERENCES chordcharts_key(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: line_id_refs_id_d541cf2a; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_measure
    ADD CONSTRAINT line_id_refs_id_d541cf2a FOREIGN KEY (line_id) REFERENCES chordcharts_line(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: measure_id_refs_id_83b30bf4; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_chord
    ADD CONSTRAINT measure_id_refs_id_83b30bf4 FOREIGN KEY (measure_id) REFERENCES chordcharts_measure(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: section_id_refs_id_9f5e43c0; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_subsection
    ADD CONSTRAINT section_id_refs_id_9f5e43c0 FOREIGN KEY (section_id) REFERENCES chordcharts_section(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: section_id_refs_id_dec98b8c; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_line
    ADD CONSTRAINT section_id_refs_id_dec98b8c FOREIGN KEY (section_id) REFERENCES chordcharts_section(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: song_id_refs_id_8dec0a40; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_chart
    ADD CONSTRAINT song_id_refs_id_8dec0a40 FOREIGN KEY (song_id) REFERENCES songs_song(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: subsection_id_refs_id_f103f045; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_line
    ADD CONSTRAINT subsection_id_refs_id_f103f045 FOREIGN KEY (subsection_id) REFERENCES chordcharts_subsection(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: time_signature_id_refs_id_cbd060db; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY chordcharts_section
    ADD CONSTRAINT time_signature_id_refs_id_cbd060db FOREIGN KEY (time_signature_id) REFERENCES chordcharts_timesignature(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: user_id_refs_id_40c41112; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_user_groups
    ADD CONSTRAINT user_id_refs_id_40c41112 FOREIGN KEY (user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: user_id_refs_id_4dc23c39; Type: FK CONSTRAINT; Schema: public; Owner: Rik
--

ALTER TABLE ONLY auth_user_user_permissions
    ADD CONSTRAINT user_id_refs_id_4dc23c39 FOREIGN KEY (user_id) REFERENCES auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: public; Type: ACL; Schema: -; Owner: Rik
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM "Rik";
GRANT ALL ON SCHEMA public TO "Rik";
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

