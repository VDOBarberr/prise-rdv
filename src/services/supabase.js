import { createClient } from '@supabase/supabase-js'


const supabaseUrl = "https://bklwoifafqnaqrlsisfb.supabase.co"

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrbHdvaWZhZnFuYXFybHNpc2ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwNTcwNjksImV4cCI6MjEwMTYzMzA2OX0.KP804uyCjq_cABMSH_xsqNQ-Exlc_SLqc6LKFF3WFJ0"


export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)