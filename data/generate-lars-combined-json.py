import time,json

def gettime(timestr):
    year = int(timestr[0:4])
    month = int(timestr[4:6])
    day = int(timestr[6:8])
    hour = int(timestr[9:11])
    minute = int(timestr[11:13])
    sec = int(timestr[13:15])
    return time.mktime(time.struct_time((year, month, day, hour, minute, sec, 6, 143, 0)))

activities = []
moves_data = json.load(open('Lars_Moves/json/daily/activities/activities_20160522.json'))
for segment in moves_data[0]["segments"]:
    for activity in segment["activities"]:
        st = gettime(activity["startTime"])
        et = gettime(activity["endTime"])
        activities.append((activity["activity"],st,et))

time.strftime("%Y %m %d %H:%M:%S", time.gmtime())

accel_data = open('lars.accelerometor.txt').readlines()

t = time.mktime(time.struct_time((2016, 5, 22, 10, 14, 23, 6, 143, 0)))
timepoints=[]
sumx, sumy, sumz  = 0.0,0.0,0.0
for line in accel_data[8:-2]:
    x,y,z,ms = line.split()
    sumx += float(x)
    sumy += float(y)
    sumz += float(z)
    t += float(ms)/1000.0
    act = "None"
    for a in activities:
        if a[1] < t < a[2]:
            act = a[0]
    timepoints.append({
        "acceleration": float(x)**2+float(y)**2+float(z)**2,
        "anglex": sumx,
        "angley": sumy,
        "anglez": sumz,
        "invalid": 0,
        "Activity": act,
        "datetime": time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime(t+3600)) })

print json.dumps(timepoints, indent=2)

