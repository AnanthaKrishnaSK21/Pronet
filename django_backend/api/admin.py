from django.contrib import admin
from .models import User, TechStack, Project, ProjectTechStack, Contributor, Request, Connection

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'email', 'title', 'location', 'created_at')
    search_fields = ('user_name', 'email')

@admin.register(TechStack)
class TechStackAdmin(admin.ModelAdmin):
    list_display = ('id', 'skill_name')
    search_fields = ('skill_name',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'owner', 'stars', 'forks', 'created_at')
    search_fields = ('title', 'owner__user_name')

@admin.register(ProjectTechStack)
class ProjectTechStackAdmin(admin.ModelAdmin):
    list_display = ('project', 'tech')

@admin.register(Contributor)
class ContributorAdmin(admin.ModelAdmin):
    list_display = ('project', 'user', 'role', 'joined_at')

@admin.register(Request)
class RequestAdmin(admin.ModelAdmin):
    list_display = ('project', 'user', 'status', 'created_at')
    list_filter = ('status',)

@admin.register(Connection)
class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('user1', 'user2', 'status', 'created_at')
